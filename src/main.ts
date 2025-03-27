import { convertTextToRules } from '../tableGenerator/convertTextToRules.ts'
import { convertRulesToTable } from '../tableGenerator/convertRulesToTable.ts'
import { createTableElement } from '../tableGenerator/createTableElement.ts';

const rules = convertTextToRules(`<S>-<A><B>⊥
<A>-a
<A>-c<A>
<B>-b<A>`)

const table = convertRulesToTable(rules)

window.onload = () => {
    const container = document.getElementById('table-container')
    if (container) {
        container.appendChild(createTableElement(table))
    }
}
