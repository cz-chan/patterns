import "./helpers/string-colors.ts";
import {
	getMessageFromModel,
	getMessageFromModelFailSafe,
} from "./actions/get-message-model.ts";
import { toolUseMain } from "./patterns/01-tool-use/tool-use.ts";
import { planningMain } from "./patterns/02-planning/planning.ts";

console.clear();

// await getMessageFromModel();
// await getMessageFromModelFailSafe();

// await toolUseMain();
await planningMain();
