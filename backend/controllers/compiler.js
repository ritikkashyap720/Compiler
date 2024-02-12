var compiler = require('codelly');
var options = { stats: true }; //prints stats to console
compiler.init(options);

function handleCompilation(req, res) {
    const { input, code, language } = req.body;
    console.log(input + " " + code + " " + language)

    function deleteFiles(){
        try {
            compiler.flush(function(){
                console.log('All temporary files flushed !');
                });
        } catch (error) {
            console.log(error)
        }
    }

    if (language == "python") {
        var envData = { cmd: "python" };
        if(input){
            compiler.compilePython(envData, code, function (data) {
                res.json(data);
                deleteFiles()
            });
        }else{
            compiler.compilePythonWithInput(envData, code, input, function (data) {
                res.send(data);
                deleteFiles()
            });
        }
    }
}

module.exports = handleCompilation;