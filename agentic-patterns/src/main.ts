import "./helpers/string-colors.ts";
import {
	getMessageFromModel,
	getMessageFromModelFailSafe,
} from "./actions/get-message-model.ts";
import { toolUseMain } from "./patterns/01-tool-use/tool-use.ts";
import { planningMain } from "./patterns/02-planning/planning.ts";
import { reflectionMain } from "./patterns/03-reflection/reflection.ts";
import { reActSimpleMain } from "./patterns/04-reAct/reAct-loop.ts";
import { reActWeatherMain } from "./patterns/04-reAct/reAct-loop.task.ts";
import { promptChainingMain } from "./patterns/05-prompt-chaining/prompt-chaining.ts";
import { planAndExecuteMain } from "./patterns/06-plan-n-execute/plan-n-execute.ts";

console.clear();

// await getMessageFromModel();
// await getMessageFromModelFailSafe();

// await toolUseMain();
// await planningMain();
// await reflectionMain();
// await reActSimpleMain();
// await reActWeatherMain();
// await promptChainingMain();
await planAndExecuteMain();
