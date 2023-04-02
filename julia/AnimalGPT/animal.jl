using HTTP, JSON3, StructTypes, Sockets

# Code from: https://juliaweb.github.io/HTTP.jl/stable/examples/#Simple-Server
# modified Animal struct to associate with specific user
mutable struct Animal
    id::Int
    userId::Base.UUID
    type::String
    name::String
    Animal() = new()
end

headers = [
        "Access-Control-Allow-Origin" => "https://chat.openai.com",
        "Access-Control-Allow-Methods" => "GET, POST, DELETE, OPTIONS", 
        "Access-Control-Allow-Headers" => "Content-Type"
]

StructTypes.StructType(::Type{Animal}) = StructTypes.Mutable()

# use a plain `Dict` as a "data store"
const ANIMALS = Dict{Int, Animal}()
const NEXT_ID = Ref(0)
function getNextId()
    id = NEXT_ID[]
    NEXT_ID[] += 1
    return id
end

# "service" functions to actually do the work
function createAnimal(req::HTTP.Request)
    animal = JSON3.read(req.body, Animal)
    animal.id = getNextId()
    ANIMALS[animal.id] = animal
    return HTTP.Response(200, headers, JSON3.write(animal))
end

function getAnimal(req::HTTP.Request)
    animalId = HTTP.getparams(req)["id"]
    animal = ANIMALS[parse(Int, animalId)]
    return HTTP.Response(200, headers, JSON3.write(animal))
end

function updateAnimal(req::HTTP.Request)
    animal = JSON3.read(req.body, Animal)
    ANIMALS[animal.id] = animal
    return HTTP.Response(200, headers, JSON3.write(animal))
end

function deleteAnimal(req::HTTP.Request)
    animalId = HTTP.getparams(req)["id"]
    delete!(ANIMALS, animalId)
    return HTTP.Response(200, headers)
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

# define REST endpoints to dispatch to "service" functions
const ANIMAL_ROUTER = HTTP.Router()
HTTP.register!(ANIMAL_ROUTER, "GET", "/logo.png", plugin_logo)
HTTP.register!(ANIMAL_ROUTER, "GET", "/.well-known/ai-plugin.json", plugin_manifest)
HTTP.register!(ANIMAL_ROUTER, "GET", "/openapi.yaml", openapi_spec)
HTTP.register!(ANIMAL_ROUTER, "POST", "/api/zoo/v1/animals", createAnimal)
# note the use of `*` to capture the path segment "variable" animal id
HTTP.register!(ANIMAL_ROUTER, "GET", "/api/zoo/v1/animals/{id}", getAnimal)
HTTP.register!(ANIMAL_ROUTER, "PUT", "/api/zoo/v1/animals", updateAnimal)
HTTP.register!(ANIMAL_ROUTER, "DELETE", "/api/zoo/v1/animals/{id}", deleteAnimal)

function run_server()
    print("Running server")
    HTTP.serve(ANIMAL_ROUTER, "0.0.0.0", 5002)
end

run_server()