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
        let bracketEnd = subequationStart;
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

    private subequationEndSearch( equation: string, subequationStart: number): number {
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
        if (equationOutput === '') {
            equationOutput = equation;
        }
        return equationOutput;
    }

    public convertEquationToLatex2(equation: string): string{
        let bracketNeeded = false;
        let equationOutput = '';
        let subEquation = '';
        let substringStart = 0;
        let substringEnd = 0;
        let currentChar = '';

        for (substringEnd; substringEnd <= equation.length; substringEnd++) {
            switch (equation.charAt(substringEnd) === '('){
                case true: { // current substring is in brackets
                    substringEnd = this.bracketEndSearch(equation, substringStart);
                    subEquation = equation.slice(substringStart, substringEnd);
                    
                    substringEnd += 1;
                    if(equation.charAt(substringStart - 1) === "*" || equation.charAt(substringEnd) === "^") { bracketNeeded = true;}
                    
                    substringStart = substringEnd + 1;

                    switch (equation.charAt(substringEnd)){
                        case "/": {

                        }

                        case "_": {

                        }
                        
                        case "^":{
                            
                        }
                        default :{

                        }
                    }
                    break;
                }
                case false: { // current substring is without brackets
                    
                    break;
                }
            }
        }

        return equationOutput;
    }
}
