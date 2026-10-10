import "./helpers/string-colors.ts";
import {
	getMessageFromModel,
	getMessageFromModelFailSafe,
} from "./actions/get-message-model.ts";

console.clear();

// await getMessageFromModel();
await getMessageFromModelFailSafe();
