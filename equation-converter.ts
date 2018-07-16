export class EquationConverter {
    private signsArray: Array<string> = ["+", "-", "*", ","];
    private equationDelimeters: Array<string> = ["+", "-", "*", "/", ",", "^", "_", "("]
    ////

    constructor() { }
    private findBracketEnd(equation: string, bracketStart: number): number {
        let bracketEnd = bracketStart;
        let bracketCounter = 0;

        for (bracketEnd; bracketEnd <= equation.length; bracketEnd++) {
            if (equation.charAt(bracketEnd) === '(') {
                bracketCounter++;
            } else if (equation.charAt(bracketEnd) === ')') {
                if (bracketCounter === 0) {
                    return bracketEnd;
                } else { bracketCounter--; }

            }
        }
        return bracketEnd + 1;
    }

    private findSubequation(equation: string) {
        let subequationEnd = 1;
        for (subequationEnd; subequationEnd <= equation.length; subequationEnd++) {
            if (this.signsArray.indexOf(equation.charAt(subequationEnd)) > -1) {
                return equation.slice(0, subequationEnd);
            }
        }
        return equation;
    }

    ////

    private bracketEndSearch(equation: string, subequationStart: number): number {
        let bracketEnd = subequationStart + 1;
        let bracketCounter = 0;

        for (bracketEnd; bracketEnd <= equation.length; bracketEnd++) {
            if (equation.charAt(bracketEnd) === '(') {
                bracketCounter++;
            } else if (equation.charAt(bracketEnd) === ')') {
                if (bracketCounter === 0) {
                    return bracketEnd;
                } else { bracketCounter--; }
            }
        }
        return bracketEnd; // returns index of closing bracket for given opening bracket
    }

    private subequationEndSearch(equation: string, subequationStart: number): number {
        let subequationEnd = subequationStart;

        for (subequationEnd; subequationEnd <= equation.length; subequationEnd++) {
            if (this.equationDelimeters.indexOf(equation.charAt(subequationEnd)) > -1) {
                return subequationEnd;
            }
        }
        return subequationEnd; // returns index of next equation delimeter
    }

    ////

    public convertEquationToLatex(equation: string): string {
        let bracketNeeded = false;
        let equationOutput = '';
        let subEquation = '';
        let substringStart = 0;
        let substringEnd = 0;
        let currentChar = '';

        for (substringEnd; substringEnd <= equation.length; substringEnd++) {
            currentChar = equation.charAt(substringEnd);
            if (equation.charAt(substringEnd) === '(') {
                equationOutput = equationOutput.concat(equation.slice(substringStart, substringEnd));
                substringStart = substringEnd + 1;
                substringEnd = this.findBracketEnd(equation, substringStart);
                if (equation.charAt(substringEnd + 1) !== '/' && equation.charAt(substringEnd + 1) !== ')') { bracketNeeded = true; }
                subEquation = this.convertEquationToLatex(equation.slice(substringStart, substringEnd));
                if (bracketNeeded) { equationOutput = equationOutput.concat('(', subEquation, ')'); }
                if (!bracketNeeded) { equationOutput = equationOutput.concat(subEquation); }
                substringStart = substringEnd + 1;
                if (equation.charAt(substringEnd + 1) === '/') {
                    equationOutput = equationOutput.concat('\\frac{', subEquation, '}{');
                    if (equation.charAt(substringEnd + 2) === '(') {
                        substringStart = substringEnd + 2;
                        substringEnd = this.findBracketEnd(equation, substringStart);
                        subEquation = this.convertEquationToLatex(equation.slice(substringStart, substringEnd + 1));
                        equationOutput = equationOutput.concat(subEquation, '}');
                    } else {
                        substringStart = substringEnd + 2;
                        subEquation = this.findSubequation(equation.slice(substringStart));
                        substringEnd += subEquation.length;
                        substringStart = substringEnd + 1;
                        equationOutput = equationOutput.concat(subEquation, '}');
                    }
                }
            } else
                if (equation.charAt(substringEnd) === '/') {
                    subEquation = equation.slice(substringStart, substringEnd);
                    equationOutput = equationOutput.concat('\\frac{', subEquation, '}{');
                    if (equation.charAt(substringEnd + 1) === '(') {
                        substringStart = substringEnd + 2;
                        substringEnd = this.findBracketEnd(equation, substringStart);
                        subEquation = this.convertEquationToLatex(equation.slice(substringStart, substringEnd));
                        equationOutput = equationOutput.concat(subEquation, '}');
                    } else {
                        substringStart = substringEnd + 1;
                        subEquation = this.findSubequation(equation.slice(substringStart));
                        substringEnd += subEquation.length;
                        substringStart = substringEnd + 1;
                        equationOutput = equationOutput.concat(subEquation, '}');
                    }
                } else
                    if (equation.charAt(substringEnd) === '^') {
                        subEquation = this.findSubequation(equation.slice(substringEnd + 1));
                        substringEnd += subEquation.length;
                        substringStart = substringEnd + 1;
                        equationOutput = equationOutput.concat('^{', subEquation, '}');
                    } else
                        if (this.signsArray.indexOf(equation.charAt(substringEnd)) > -1) {
                            equationOutput = equationOutput.concat(equation.slice(substringStart, substringEnd + 1));
                            substringStart = substringEnd + 1;
                        }
        }
        if (substringStart != substringEnd - 1) {
            equationOutput = equation.slice(substringStart, substringEnd);
        }
        return equationOutput;
    }

    public convertEquationToLatex2(equation: string): string {
        let bracketNeeded = false;
        let equationOutput = '';
        let subEquation = '';
        let substringStart = 0;
        let substringEnd = 0;
        let currentChar = '';

        for (substringEnd; substringEnd <= equation.length; substringEnd++) {
            switch (equation.charAt(substringEnd) === '(') {
                case true: { // current substring is in brackets
                    substringEnd = this.bracketEndSearch(equation, substringStart);
                    subEquation = this.convertEquationToLatex2(equation.slice(substringStart + 1, substringEnd));

                    substringEnd += 1;
                    if (equation.charAt(substringStart - 1) === '*' || equation.charAt(substringEnd) === '^') { bracketNeeded = true; }

                    substringStart = substringEnd + 1;

                    switch (equation.charAt(substringEnd)) {
                        case '/': {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(\\frac{', subEquation, '}{');
                            } else {
                                equationOutput = equationOutput.concat('\\frac{', subEquation, '}{');
                            }
                            if (equation.charAt(substringStart) === '(') {
                                substringEnd = this.bracketEndSearch(equation, substringStart);
                                subEquation = this.convertEquationToLatex2(equation.slice(substringStart + 1, substringEnd));
                                if (bracketNeeded) {
                                    equationOutput = equationOutput.concat(subEquation, '})');
                                    bracketNeeded = false;
                                } else {
                                    equationOutput = equationOutput.concat(subEquation, '}');
                                }
                                substringEnd += 1;
                                substringStart = substringEnd + 1;

                            } else {
                                substringEnd = this.subequationEndSearch(equation, substringStart);
                                subEquation = equation.slice(substringStart, substringEnd);
                                if (equation.charAt(substringEnd) === '(') {
                                    substringStart = substringEnd;
                                    substringEnd = this.bracketEndSearch(equation, substringStart);
                                    subEquation = subEquation.concat('(', equation.slice(substringStart + 1, substringEnd));
                                }
                                equationOutput = equationOutput.concat(subEquation, equation.charAt(substringEnd));
                                substringEnd += 1;
                                substringStart = substringEnd + 1;
                            }
                            break;
                        }

                        case '_': {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(', subEquation, '_');
                            } else {
                                equationOutput = equationOutput.concat(subEquation, '_');
                            }
                            substringEnd = this.subequationEndSearch(equation, substringStart);
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat(
                                    '{', equation.slice(substringStart, substringEnd), '})', equation.charAt(substringEnd));
                                    bracketNeeded = false;
                            } else {
                                equationOutput = equationOutput.concat(
                                    '{', equation.slice(substringStart, substringEnd), '}', equation.charAt(substringEnd));
                            }
                            break;
                        }

                        case '^': {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(', subEquation, ')', equation.charAt(substringEnd));
                            } else {
                                equationOutput = equationOutput.concat(subEquation, equation.charAt(substringEnd));
                            }
                            substringEnd = this.subequationEndSearch(equation, substringStart);
                            equationOutput = equationOutput.concat(
                                '{', equation.slice(substringStart, substringEnd), '}', equation.charAt(substringEnd));
                                substringStart = substringEnd + 1;
                            break;
                        }
                        default: {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(', subEquation, ')', equation.charAt(substringEnd));
                            } else {
                                equationOutput = equationOutput.concat(subEquation, equation.charAt(substringEnd));
                            }
                            break;
                        }
                    }
                    break;
                }
                case false: { // current substring is without brackets
                    substringEnd = this.subequationEndSearch(equation, substringStart);
                    subEquation = equation.slice(substringStart)

                    substringEnd += 1;
                    if (equation.charAt(substringStart - 1) === '*' || equation.charAt(substringEnd) === '^') { bracketNeeded = true; }

                    substringStart = substringEnd + 1;

                    switch (equation.charAt(substringEnd)) {
                        case '/': {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(\\frac{', subEquation, '}{');
                            } else {
                                equationOutput = equationOutput.concat('\\frac{', subEquation, '}{');
                            }
                            if (equation.charAt(substringStart) === '(') {
                                substringEnd = this.bracketEndSearch(equation, substringStart);
                                subEquation = this.convertEquationToLatex2(equation.slice(substringStart + 1, substringEnd));
                                if (bracketNeeded) {
                                    equationOutput = equationOutput.concat(subEquation, '})');
                                    bracketNeeded = false;
                                } else {
                                    equationOutput = equationOutput.concat(subEquation, '}');
                                }
                                substringEnd += 1;
                                substringStart = substringEnd + 1;

                            } else {
                                substringEnd = this.subequationEndSearch(equation, substringStart);
                                subEquation = equation.slice(substringStart, substringEnd);
                                if (equation.charAt(substringEnd) === '(') {
                                    substringStart = substringEnd;
                                    substringEnd = this.bracketEndSearch(equation, substringStart);
                                    subEquation = subEquation.concat('(', equation.slice(substringStart + 1, substringEnd));
                                }
                                equationOutput = equationOutput.concat(subEquation, equation.charAt(substringEnd));
                                substringEnd += 1;
                                substringStart = substringEnd + 1;
                            }
                            break;
                        }

                        case '_': {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(', subEquation, '_');
                            } else {
                                equationOutput = equationOutput.concat(subEquation, '_');
                            }
                            substringEnd = this.subequationEndSearch(equation, substringStart);
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat(
                                    '{', equation.slice(substringStart, substringEnd), '})', equation.charAt(substringEnd));
                                    bracketNeeded = false;
                            } else {
                                equationOutput = equationOutput.concat(
                                    '{', equation.slice(substringStart, substringEnd), '}', equation.charAt(substringEnd));
                            }
                            break;
                        }

                        case '^': {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(', subEquation, ')', equation.charAt(substringEnd));
                            } else {
                                equationOutput = equationOutput.concat(subEquation, equation.charAt(substringEnd));
                            }
                            substringEnd = this.subequationEndSearch(equation, substringStart);
                            equationOutput = equationOutput.concat(
                                '{', equation.slice(substringStart, substringEnd), '}', equation.charAt(substringEnd));
                                substringStart = substringEnd + 1;
                            break;
                        }
                        default: {
                            if (bracketNeeded) {
                                equationOutput = equationOutput.concat('(', subEquation, ')', equation.charAt(substringEnd));
                            } else {
                                equationOutput = equationOutput.concat(subEquation, equation.charAt(substringEnd));
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return equationOutput;
    }
}
