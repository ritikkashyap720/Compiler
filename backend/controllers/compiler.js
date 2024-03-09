var compiler = require('codelly');
var options = { stats: true }; //prints stats to console
compiler.init(options);

function handleCompilation(req, res) {
    const { language, code } = req.body;
    const input = req.body?.input

    function deleteTempFiles() {
        try {
            compiler.flush(function () {
                console.log('All temporary files flushed !');
            });

        } catch (error) {
            console.log("hello"+error)
        }
    }

    //if your server's python command is 'python'
    try {
        if (language == "python") {
            var envData = { cmd: "python" };
            if (input!=" ") {
                compiler.compilePythonWithInput(envData, code, input, function (data) {
                    res.json(data)
                    console.log(data+"27")
                    deleteTempFiles()
                    console.log(input)
                });
            } else {
                compiler.compilePython(envData, code, function (data) {
                    res.send(data);
                    console.log(data+"33")
                    deleteTempFiles()
                });
            }
        } else if (language == "c++") {
            //if windows
            var envData = { OS: "windows", cmd: "g++", options: { timeout: 100000 } };

            if (input!=" ") {
                //With Input
                compiler.compileCPPWithInput(envData, code, input, function (data) {
                    res.send(data);
                    deleteTempFiles()
                });
            } else {
                compiler.compileCPP(envData, code, function (data) {
                    res.send(data);
                    deleteTempFiles()
                });

            }

        } else if (language == "java") {
            //if windows
            var envData = { OS: "windows" };
            if (input!=" ") {
                compiler.compileJavaWithInput(envData, code, input, function (data) {
                    deleteTempFiles()
                    res.send(data);
                });

            } else {
                compiler.compileJava(envData, code, function (data) {
                    res.send(data);
                    deleteTempFiles()
                });
            }

        }
    } catch (error) {
        console.log(error)
    }


}

module.exports = handleCompilation;