(function(){

    "use strict";

    describe("Jasmine async exploration", function() {

        it("simple sync test", function() {
            expect(1 + 1).toBe(2);
        });

        it("getScript test", function() {

            console.log("Entering 'getScript test'");

            var flag = false;

            console.log("About to call $.getScript");
            $.getScript("/JasmineAsyncExploration/LoadMe.js", function () {
                console.log("Inside $.getScript success fn");
                console.log(arguments);
                flag = true;
            }).fail(function () {
                console.log("Inside $.getScript error fn");
                console.log(arguments);
                flag = true;
            });

            waitsFor(function () {
                console.log("Inside waitsFor fn - returning: " + flag);
                return flag;
            }, "loaded to be set", 1000);

            runs(function() {
                console.log("Entering runs fn");
                expect(flag).toBe(true);
                console.log("Leaving runs fn");
            });

            console.log("Leaving 'getScript test'");
        });

        it("multiple parallel waitsFor", function() {

            console.log("Entering 'multiple parallel waitsFor'");

            var flags = [];

            [0, 1, 2, 3, 4, 5, 6].forEach(function(index) {

                console.log("Entering forEach fn - index: " + index);

                flags[index] = false;

                console.log("About to call $.getScript - index: " + index);
                $.getScript("/JasmineAsyncExploration/LoadMe.js", function () {
                    console.log("Inside $.getScript success fn - index: " + index);
                    console.log(arguments);
                    flags[index] = true;
                }).fail(function () {
                    console.log("Inside $.getScript error fn - index: " + index);
                    console.log(arguments);
                    flags[index] = true;
                });

                waitsFor(function () {
                    var flag = flags[index];
                    console.log("Inside waitsFor fn index: " + index + "; returning: " + flag);
                    return flag;
                }, "loaded to be set", 1000);

                console.log("Leaving forEach fn - index: " + index);
            });

            runs(function() {
                console.log("Entering runs fn");
                expect(flags.length).toBe(7);
                flags.forEach(function(flag){
                    expect(flag).toBe(true);
                });
                console.log("Leaving runs fn");
            });

            console.log("Leaving 'multiple parallel waitsFor'");
        });

        it("multiple sequential waitsFor", function() {

            console.log("Entering 'multiple sequential waitsFor'");

            var max = 3;
            var flags = [];

            var beginGetScript = function(index) {
                console.log("About to call $.getScript - index: " + index);
                flags[index] = false;
                $.getScript("/JasmineAsyncExploration/LoadMe.js", function () {
                    console.log("Inside $.getScript success fn - index: " + index);
                    console.log(arguments);
                    flags[index] = true;
                }).fail(function () {
                    console.log("Inside $.getScript error fn - index: " + index);
                    console.log(arguments);
                    flags[index] = true;
                });
            };

            var waitForGetScript = function(index) {
                waitsFor(function () {
                    console.log("Entering waitsFor fn - index: " + index);
                    var flag = flags[index];
                    if (!flag) {
                        console.log("Leaving waitsFor fn - index: " + index + "; returning: false");
                        return false;
                    }
                    var newIndex = index + 1;
                    if (newIndex < max) {
                        beginGetScript(newIndex);
                        waitForGetScript(newIndex);
                    }
                    console.log("Leaving waitsFor fn - index: " + index + "; returning: true");
                    return true;
                }, "loaded to be set", 1000);
            };

            beginGetScript(0);
            waitForGetScript(0);

            runs(function() {
                console.log("Entering runs fn");
                expect(flags.length).toBe(3);
                flags.forEach(function(flag){
                    expect(flag).toBe(true);
                });
                console.log("Leaving runs fn");
            });

            console.log("Leaving 'multiple sequential waitsFor'");
        });
    });
}());
