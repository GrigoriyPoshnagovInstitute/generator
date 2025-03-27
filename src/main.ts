import GuidesBuilder from "./guidesBuilder/GuidesBuilder";
import TableBuilder from "./tableBuilder/TableBuilder";
import LLParser from "./LLParser/LLParser";
import { stringifyError } from "./LLParser/error/StringifyError";

document.addEventListener("DOMContentLoaded", () => {
    const grammarTextArea = document.getElementById("grammarInput") as HTMLTextAreaElement;
    const testTextArea = document.getElementById("testInput") as HTMLTextAreaElement;
    const parseButton = document.getElementById("parseButton") as HTMLButtonElement;
    const outputPre = document.getElementById("output") as HTMLPreElement;

    parseButton.addEventListener("click", async () => {
        try {
            const grammarText = grammarTextArea.value.trim();
            const testText = testTextArea.value.trim();

            if (!grammarText) {
                throw new Error("Введите правила грамматики.");
            }
            if (!testText) {
                throw new Error("Введите текст для проверки.");
            }

            // Создание правил из введённых грамматических правил
            const guidesBuilder = new GuidesBuilder(grammarText);
            const rules = guidesBuilder.buildGuidedRules();
            if (!rules) {
                throw new Error("Ошибка генерации правил.");
            }

            const tableBuilder = new TableBuilder(rules);
            const table = tableBuilder.buildTable();
            const parser = new LLParser(table);

            // Разбор строк тестового текста
            const lines = testText.split("\n").map(line => line.trim());
            const results: string[] = [];

            for (const line of lines) {
                if (parser.parse(line)) {
                    results.push("OK");
                } else {
                    const error = parser.getError();
                    results.push(error ? stringifyError(error) : "Ошибка лексера.");
                }
            }

            outputPre.textContent = results.join("\n");
        } catch (e: any) {
            outputPre.textContent = `Ошибка: ${e.message}`;
        }
    });
});
