import { t } from "@rbxts/t";
import { CenturionType } from ".";
import { BaseRegistry, TransformResult, TypeBuilder } from "../../core";

const transformToNumber = (text: string) => {
	const num = tonumber(text);
	if (num === undefined) {
		return TransformResult.err<number>(`Invalid number: ${text}`);
	}

	return TransformResult.ok(num);
};

const stringType = TypeBuilder.create<string>(CenturionType.String)
	.validate(t.string)
	.transform((text) => TransformResult.ok(text))
	.build();

const numberType = TypeBuilder.create<number>(CenturionType.Number)
	.validate(t.number)
	.transform(transformToNumber)
	.build();

const integerType = TypeBuilder.create<number>(CenturionType.Integer)
	.validate(t.integer)
	.transform((text) => {
		const numResult = transformToNumber(text);
		if (!numResult.ok) {
			return numResult;
		}

		const num = numResult.value;
		return t.integer(num)
			? TransformResult.ok(num)
			: TransformResult.err(`Invalid integer: ${text}`);
	})
	.build();

const truthyValues = new Set<string>(["true", "yes", "y"]);
const falsyValues = new Set<string>(["false", "no", "n"]);
const booleanType = TypeBuilder.create<boolean>(CenturionType.Boolean)
	.validate(t.boolean)
	.transform((text) => {
		const textLower = text.lower();
		if (truthyValues.has(textLower)) return TransformResult.ok(true);
		if (falsyValues.has(textLower)) return TransformResult.ok(false);

		return TransformResult.err(`Invalid boolean: ${text}`);
	})
	.build();

export = (registry: BaseRegistry) => {
	registry.registerType(stringType, numberType, integerType, booleanType);
};
