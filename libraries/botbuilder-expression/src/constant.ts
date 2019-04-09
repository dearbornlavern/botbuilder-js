import { Expression, ReturnType } from './expression';
import { ExpressionEvaluator } from './expressionEvaluator';
import { ExpressionType } from './expressionType';

/**
 * Construct an expression constant.
 */
export class Constant extends Expression {

    /**
     * Constant value.
     */
    public get Value(): any {
        return this._value;
    }

    public set Value(theValue: any) {
        this.Evaluator.ReturnType =
            typeof theValue === 'string' ? ReturnType.String
                : typeof theValue === 'boolean' ? ReturnType.Boolean // boolean should in front of number, 'false' is also a number -> 0
                : !Number.isNaN(theValue) ? ReturnType.Number
                        : ReturnType.Object;

        this._value = theValue;
    }

    private _value: any;
    public constructor(value: any) {
        super(ExpressionType.Constant, new ExpressionEvaluator(
            (expression: Expression, state: any): { value: any; error: string } => {
                return { value: (<Constant>expression).Value, error: undefined };
            }
        ));
        this.Value = value;
    }

    public toString(): string {
        if (this.Value === undefined) {
            return 'null';
        }

        if (typeof this.Value === 'string') {
            return `'${this.Value}'`;
        }

        return this.Value === undefined ? undefined : this.Value.toString();
    }
}