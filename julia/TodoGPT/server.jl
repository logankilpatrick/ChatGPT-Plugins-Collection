using HTTP
using JSON
using FileIO

const todos = Dict{String, Vector{Any}}()

headers = [
        "Access-Control-Allow-Origin" => "https://chat.openai.com",
        "Access-Control-Allow-Methods" => "GET, POST, DELETE, OPTIONS", 
        "Access-Control-Allow-Headers" => "Content-Type"
]

function add_todo(req::HTTP.Request, username::String)
    print("Adding TODOs")
    todo = JSON.parse(String(req.body))
    if !haskey(todos, username)
        todos[username] = []
    end
    push!(todos[username], todo)
    return HTTP.Response(200, headers, "OK")
end

function get_todos(req::HTTP.Request, username::String)
    print("Attempting to get TODOs")
    user_todos = get(todos, username, [])
    return HTTP.Response(200, headers, JSON.json(user_todos))
end

function delete_todo(req::HTTP.Request, username::String)
    print("Deleting a TODO")
    todo_idx = JSON.parse(String(req.body))["todo_idx"]
    if haskey(todos, username) && 1 <= todo_idx <= length(todos[username])
        deleteat!(todos[username], todo_idx)
    end
    return HTTP.Response(200, headers, "OK")
end

function plugin_logo(req::HTTP.Request)
    filename = "logo.png"
    mimetype = "image/png"
    headers = HTTP.Headers(["Content-Type" => mimetype])
    body = read(filename)
    return HTTP.Response(200, headers, body)
end

function plugin_manifest(req::HTTP.Request)
    host = "http://$(req["Host"])"
    text = read("./.well-known/ai-plugin.json", String)
    text = replace(text, "PLUGIN_HOSTNAME" => host)
    local_headers = push!(headers, "Content-Type" => "text/json")
    return HTTP.Response(200, local_headers, text)
end

function openapi_spec(req::HTTP.Request)
    print("Retrieving the OpenAPI spec")
    host = "http://$(req["Host"])"
    text = read("openapi.yaml", String)
    text = replace(text, "PLUGIN_HOSTNAME" => host)
    local_headers = push!(headers, "Content-Type" => "text/yaml")
    return HTTP.Response(200, local_headers, text)
end

router = HTTP.Handlers.Router()

HTTP.register!(router, "POST", "/todos/{username}", add_todo)
HTTP.register!(router, "GET", "/todos/{username}", get_todos)
HTTP.register!(router, "DELETE", "/todos/{username}", delete_todo)
HTTP.register!(router, "GET", "/logo.png", plugin_logo)
HTTP.register!(router, "GET", "/.well-known/ai-plugin.json", plugin_manifest)
HTTP.register!(router, "GET", "/openapi.yaml", openapi_spec)

server = router

function run_server()
    print("Running server")
    HTTP.serve(server, "0.0.0.0", 5002)
end
