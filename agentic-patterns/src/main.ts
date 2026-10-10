import "./helpers/string-colors.ts";
import {
	getMessageFromModel,
	getMessageFromModelFailSafe,
} from "./actions/get-message-model.ts";
import { toolUseMain } from "./patterns/01-tool-use/tool-use.ts";

console.clear();

// await getMessageFromModel();
// await getMessageFromModelFailSafe();

await toolUseMain();
