using HTTP

const ROUTER = HTTP.Router()

headers = [
        "Access-Control-Allow-Origin" => "https://chat.openai.com",
        "Access-Control-Allow-Methods" => "GET, POST, DELETE, OPTIONS", 
        "Access-Control-Allow-Headers" => "Content-Type"
]

function square(req::HTTP.Request)
    body = parse(Float64, String(req.body))
    square = body^2
    HTTP.Response(200, headers, string(square))
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

HTTP.register!(ROUTER, "POST", "/api/square", square)
HTTP.register!(ROUTER, "GET", "/logo.png", plugin_logo)
HTTP.register!(ROUTER, "GET", "/.well-known/ai-plugin.json", plugin_manifest)
HTTP.register!(ROUTER, "GET", "/openapi.yaml", openapi_spec)

function run_server()
    print("Running server")
    HTTP.serve(ROUTER, "0.0.0.0", 5002)
end

run_server()
