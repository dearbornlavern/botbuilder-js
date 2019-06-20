const { TemplateEngine } = require('../');
const assert = require('assert');

function GetExampleFilePath(fileName) {
    return `${__dirname}/testData/examples/` + fileName;
}


describe('LG', function () {
    it('TestBasic', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('2.lg'));
        let evaled = engine.evaluateTemplate("wPhrase");
        const options = ['Hi', 'Hello', 'Hiya'];
        assert.strictEqual(options.includes(evaled), true, `The result ${evaled} is not in those options [${options.join(",")}]`);
    });

    it('TestBasicTemplateReference', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('3.lg'));
        let evaled = engine.evaluateTemplate("welcome-user", undefined);
        const options = ["Hi", "Hello", "Hiya", "Hi :)", "Hello :)", "Hiya :)"];
        assert.strictEqual(options.includes(evaled), true, `The result ${evaled} is not in those options [${options.join(",")}]`);
    });

    it('TestBasicTemplateRefAndEntityRef', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('4.lg'));
        let userName = 'DL';
        let evaled = engine.evaluateTemplate("welcome-user", { userName: userName });
        const options = ["Hi", "Hello", "Hiya ", "Hi :)", "Hello :)", "Hiya :)"];
        assert.strictEqual(evaled.includes(userName), true, `The result ${evaled} does not contiain ${userName}`);
    });

    it('TestBaicConditionalTemplate', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('5.lg'));

        let evaled = engine.evaluateTemplate("time-of-day-readout", { timeOfDay: "morning" });
        assert.strictEqual(evaled === "Good morning" || evaled === "Morning! ", true, `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("time-of-day-readout", { timeOfDay: "evening" });
        assert.strictEqual(evaled === "Good evening" || evaled === "Evening! ", true, `Evaled is ${evaled}`);
    });

    it('TestBasicConditionalTemplateWithoutDefault', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('5.lg'));

        let evaled = engine.evaluateTemplate("time-of-day-readout-without-default", { timeOfDay: "morning" });
        assert.strictEqual(evaled === "Good morning" || evaled === "Morning! ", true, `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("time-of-day-readout-without-default2", { timeOfDay: "morning" });
        assert.strictEqual(evaled === "Good morning" || evaled === "Morning! ", true, `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("time-of-day-readout-without-default2", { timeOfDay: "evening" });
        assert.strictEqual(evaled, undefined, `Evaled is ${evaled} which should be undefined.`);
    });

    it('TestBasicTemplateRefWithParameters', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('6.lg'));

        let evaled = engine.evaluateTemplate("welcome", undefined);
        const options1 = ["Hi DongLei :)", "Hey DongLei :)", "Hello DongLei :)"]
        assert.strictEqual(options1.includes(evaled), true, `Evaled is ${evaled}`);

        const options2 = ["Hi DL :)", "Hey DL :)", "Hello DL :)"]
        evaled = engine.evaluateTemplate("welcome", { userName: "DL" });
        assert.strictEqual(options2.includes(evaled), true, `Evaled is ${evaled}`);
    });

    it('TestBasicSwitchCaseTemplate', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('switchcase.lg'));
        let evaled1 = engine.evaluateTemplate('greetInAWeek', { day: "Saturday" });
        assert.strictEqual(evaled1 === "Happy Saturday!", true, `Evaled is ${evaled1}`);

        let evaled2 = engine.evaluateTemplate('greetInAWeek', { day: "Sunday" });
        assert.strictEqual(evaled2 === "Happy Sunday!", true, `Evaled is ${evaled2}`);

        let evaled3 = engine.evaluateTemplate('greetInAWeek', { day: "Monday" });
        assert.strictEqual(evaled3 === "Work Hard!", true, `Evaled is ${evaled3}`);
    });

    it('TestBasicListSupport', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('BasicList.lg'));

        let evaled = engine.evaluateTemplate("BasicJoin", { items: ["1"] });
        assert.strictEqual(evaled, "1", `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("BasicJoin", { items: ["1", "2"] });
        assert.strictEqual(evaled, "1, 2", `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("BasicJoin", { items: ["1", "2", "3"] });
        assert.strictEqual(evaled, "1, 2 and 3", `Evaled is ${evaled}`);
    });

    it('TestBasicExtendedFunctions', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('6.lg'));
        const alarms = [
            {
                time: "7 am",
                date: "tomorrow"
            },
            {
                time: "8 pm",
                date: "tomorrow"
            }
        ];

        let evaled = engine.evaluateTemplate('ShowAlarmsWithForeach', { alarms: alarms });
        assert.strictEqual(evaled === "You have 2 alarms, 7 am at tomorrow and 8 pm at tomorrow", true, `Evaled is ${evaled}`);

        // let evaled = engine.evaluateTemplate('ShowAlarmsWithMemberHumanize',{alarms:alarms});
        // assert.strictEqual(evaled === "You have 2 alarms, 7 am at tomorrow and 8 pm at tomorrow", true, `Evaled is ${evaled}`);
    });

    it('TestCaseInsensitive', function () {
        let engine = new TemplateEngine().addFile(GetExampleFilePath('CaseInsensitive.lg'));
        const alarms = [
            {
                time: "7 am",
                date: "tomorrow"
            },
            {
                time: "8 pm",
                date: "tomorrow"
            }
        ];

        let evaled = engine.evaluateTemplate('ShowAlarms', { alarms: alarms });
        assert.strictEqual(evaled === "You have two alarms", true, `Evaled is ${evaled}`);

        let evaled1 = engine.evaluateTemplate('greetInAWeek', { day: "Saturday" });
        assert.strictEqual(evaled1 === "Happy Saturday!", true, `Evaled is ${evaled1}`);
    });

    it('TestListWithOnlyOneElement', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("8.lg"));
        var evaled = engine.evaluateTemplate("ShowTasks", { recentTasks: ['Task1'] });
        assert.strictEqual(evaled === "Your most recent task is Task1. You can let me know if you want to add or complete a task.", true, `Evaled is ${evaled}`);
    });

    it('TestTemplateNameWithDotIn', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("TemplateNameWithDot.lg"));
        var evaled1 = engine.evaluateTemplate("Hello.World", "");
        assert.strictEqual(evaled1 === "Hello World", true, `Evaled is ${evaled1}`);

        var evaled2 = engine.evaluateTemplate("Hello", "");
        assert.strictEqual(evaled2 === "Hello World", true, `Evaled is ${evaled2}`);
    });

    it('TestBasicInlineTemplate', function () {
        var emptyEngine = new TemplateEngine().addText("", "test", undefined);
        assert.strictEqual(emptyEngine.evaluate("Hi"), "Hi", emptyEngine.evaluate("Hi"));
        assert.strictEqual(emptyEngine.evaluate("Hi", ""), "Hi", emptyEngine.evaluate("Hi", ""));

        assert.strictEqual(emptyEngine.evaluate("Hi {name}", { name: 'DL' }), "Hi DL");

        assert.strictEqual(emptyEngine.evaluate("Hi {name.FirstName}{name.LastName}", { name: { FirstName: "D", LastName: "L" } }), "Hi DL");
        assert.strictEqual(emptyEngine.evaluate("Hi \n Hello", ""), "Hi \n Hello");
        assert.strictEqual(emptyEngine.evaluate("Hi \r\n Hello", ""), "Hi \r\n Hello");
        assert.strictEqual(emptyEngine.evaluate("Hi \r\n @{name}", { name: "DL" }), "Hi \r\n DL");
        assert.strictEqual(new TemplateEngine().evaluate("Hi", ""), "Hi");
    });

    it('TestInlineTemplateWithTemplateFile', function () {
        var emptyEngine = new TemplateEngine().addFile(GetExampleFilePath("8.lg"));
        assert.strictEqual(emptyEngine.evaluate("Hi"), "Hi", emptyEngine.evaluate("Hi"));
        assert.strictEqual(emptyEngine.evaluate("Hi", ""), "Hi", emptyEngine.evaluate("Hi", ""));

        assert.strictEqual(emptyEngine.evaluate("Hi {name}", { name: 'DL' }), "Hi DL", emptyEngine.evaluate("Hi {name}", { name: 'DL' }));

        assert.strictEqual(emptyEngine.evaluate("Hi {name.FirstName}{name.LastName} [RecentTasks]", { name: { FirstName: "D", LastName: "L" } }), "Hi DL You don't have any tasks.", emptyEngine.evaluate("Hi {name.FirstName}{name.LastName} [RecentTasks]", { name: { FirstName: "D", LastName: "L" } }));

        assert.strictEqual(emptyEngine.evaluate("Hi {name.FirstName}{name.LastName} [RecentTasks]", { name: { FirstName: "D", LastName: "L" }, recentTasks: ["task1"] }), "Hi DL Your most recent task is task1. You can let me know if you want to add or complete a task.", emptyEngine.evaluate("Hi {name.FirstName}{name.LastName} [RecentTasks]", { name: { FirstName: "D", LastName: "L" }, recentTasks: ["task1"] }));

    });

    it('TestMultiLine', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("MultilineTextForAdaptiveCard.lg"));
        var evaled1 = engine.evaluateTemplate("wPhrase", "");
        var options1 = ["\r\ncardContent\r\n", "hello", "\ncardContent\n"];
        assert.strictEqual(options1.includes(evaled1), true, `1.Evaled is ${evaled1}`);

        var evaled2 = engine.evaluateTemplate("nameTemplate", { name: "N" });
        var options2 = ["\r\nN\r\n", "N", "\nN\n"];
        assert.strictEqual(options2.includes(evaled2), true, `2.Evaled is ${evaled2}`);

        var evaled3 = engine.evaluateTemplate("adaptivecardsTemplate", "");
        console.log(evaled3);

        var evaled4 = engine.evaluateTemplate("refTemplate", "");
        var options4 = ["\r\nhi\r\n", "\nhi\n"];
        assert.strictEqual(options4.includes(evaled4), true, `4.Evaled is ${evaled4}`);
    });

    it('TestTemplateRef', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("TemplateRef.lg"));
        var scope = { time: "morning", name: "Dong Lei" };
        var evaled = engine.evaluateTemplate("Hello", scope);
        assert.strictEqual(evaled, "Good morning Dong Lei", `Evaled is ${evaled}`);
    });

    it('TestEscapeCharacter', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("EscapeCharacter.lg"));
        var evaled = engine.evaluateTemplate("wPhrase", null);
        assert.strictEqual(evaled, "Hi \r\n\t[]{}\\", "Happy path failed.");
    });

    it('TestAnalyzer', function () {
        var testData = [
            {
                name:'orderReadOut',
                variableOptions:["orderType", "userName", "base", "topping", "bread", "meat"],
                templateRefOptions:["wPhrase", "pizzaOrderConfirmation", "sandwichOrderConfirmation"]
            },
            {
                name:'sandwichOrderConfirmation',
                variableOptions:["bread", "meat"],
                templateRefOptions:[]
            },
            {
                name:'template1',
                 // TODO: input.property should really be: customer.property but analyzer needs to be 
                variableOptions:["alarms", "customer", "tasks[0]", "age", "city"],
                templateRefOptions:["template2", "template3", "template4", "template5","template6"]
            },
            {
                name:'coffee-to-go-order',
                variableOptions:['coffee', 'userName', 'size', 'price'],
                templateRefOptions:["wPhrase", "LatteOrderConfirmation", "MochaOrderConfirmation","CuppuccinoOrderConfirmation"]
            },
        ]
        for (const testItem of testData) {
            var engine = new TemplateEngine().addFile(GetExampleFilePath("Analyzer.lg"));
            var evaled1 = engine.analyzeTemplate(testItem.name);
            var variableEvaled = evaled1.Variables;
            var variableEvaledOptions = testItem.variableOptions;
            assert.strictEqual(variableEvaled.length, variableEvaledOptions.length);
            variableEvaledOptions.forEach(element => assert.strictEqual(variableEvaled.includes(element), true));
            var templateEvaled = evaled1.TemplateReferences;
            var templateEvaledOptions = testItem.templateRefOptions;
            assert.strictEqual(templateEvaled.length, templateEvaledOptions.length);
            templateEvaledOptions.forEach(element => assert.strictEqual(templateEvaled.includes(element), true));
        }
    });

    it('TestlgTemplateFunction', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("lgTemplate.lg"));
        var evaled = engine.evaluateTemplate('TemplateC', '');
        var options = ['Hi', 'Hello'];
        assert.strictEqual(options.includes(evaled), true);

        evaled = engine.evaluateTemplate('TemplateD', { b: "morning" });
        options = ['Hi morning', 'Hello morning'];
        assert.strictEqual(options.includes(evaled), true);
    });

    it('TestAnalyzelgTemplateFunction', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("lgTemplate.lg"));
        var evaled = engine.analyzeTemplate('TemplateD');
        var variableEvaled = evaled.Variables;
        var options = ['b'];
        assert.strictEqual(variableEvaled.length, options.length);
        options.forEach(e => assert.strictEqual(variableEvaled.includes(e), true));
    });

    it('TestExceptionCatch', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("ExceptionCatch.lg"));
        try {
            engine.evaluateTemplate("NoVariableMatch");
            assert.fail('Should throw exception.')
        } catch (e) {
            console.log(e.message);
        }
    })

    it('TestMultipleLgFiles', function () {
        var file123 = [
            GetExampleFilePath("MultiFile-Part1.lg"),
            GetExampleFilePath("MultiFile-Part2.lg"),
            GetExampleFilePath("MultiFile-Part3.lg"),
        ];

        var engine = new TemplateEngine().addFiles([file123[2], file123[1], file123[0]]);

        var msg = "hello from t1, ref template2: 'hello from t2, ref template3: hello from t3' and ref template3: 'hello from t3'";
        assert.strictEqual(engine.evaluateTemplate("template1"), msg);
    })

    it('TestImportLgFiles', function () {
        var engine = new TemplateEngine().addFile(GetExampleFilePath("import.lg"));
        
        // Assert 6.lg is imported only once when there are several relative paths which point to the same file.
        // Assert import cycle loop is handled well as expected when a file imports itself.
        assert.strictEqual(engine.templates.length, 11);

        const options1 = ["Hi", "Hello"];
        var evaled = engine.evaluateTemplate("basicTemplate");
        assert.strictEqual(options1.includes(evaled), true, `Evaled is ${evaled}`);

        const options2 = ["Hi DongLei :)", "Hey DongLei :)", "Hello DongLei :)"];
        evaled = engine.evaluateTemplate("welcome");
        assert.strictEqual(options2.includes(evaled), true, `Evaled is ${evaled}`);

        const options3 = ["Hi DL :)", "Hey DL :)", "Hello DL :)"];
        evaled = engine.evaluateTemplate("welcome", { userName: "DL" });
        assert.strictEqual(options3.includes(evaled), true, `Evaled is ${evaled}`);

        const options4 = ["Hi 2", "Hello 2"];
        evaled = engine.evaluateTemplate("basicTemplate2");
        assert.strictEqual(options4.includes(evaled), true, `Evaled is ${evaled}`);

        // Assert 6.lg of absolute path is imported from text.
        var importedFilePath = GetExampleFilePath("6.lg");
        engine = new TemplateEngine().addText(`# basicTemplate\r\n- Hi\r\n- Hello\r\n[import](${importedFilePath})`, 'test', undefined);

        assert.strictEqual(engine.templates.length, 8);

        evaled = engine.evaluateTemplate("basicTemplate");
        assert.strictEqual(options1.includes(evaled), true, `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("welcome");
        assert.strictEqual(options2.includes(evaled), true, `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("welcome", { userName: "DL" });
        assert.strictEqual(options3.includes(evaled), true, `Evaled is ${evaled}`);

        // Assert 6.lg of relative path is imported from text.
        engine = new TemplateEngine().addText(`# basicTemplate\r\n- Hi\r\n- Hello\r\n[import](./tests/testData/examples/6.lg)`, 'test', undefined);

        assert.strictEqual(engine.templates.length, 8);

        evaled = engine.evaluateTemplate("basicTemplate");
        assert.strictEqual(options1.includes(evaled), true, `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("welcome");
        assert.strictEqual(options2.includes(evaled), true, `Evaled is ${evaled}`);

        evaled = engine.evaluateTemplate("welcome", { userName: "DL" });
        assert.strictEqual(options3.includes(evaled), true, `Evaled is ${evaled}`);
    });
});