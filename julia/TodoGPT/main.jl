using Revise
include("server.jl")

function main()
    run_server()
end

if isinteractive()
    @async main()
else
    main()
end