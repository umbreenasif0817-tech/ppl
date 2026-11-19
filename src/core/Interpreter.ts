import {
  Token,
  TokenType,
  ASTNode,
  InterpreterResult,
  CommandDoc,
} from '../types/interpreter';

/**
 * ============================================================================
 * OBJECT-ORIENTED PROGRAMMING (OOP) PARADIGM SHOWCASE:
 * Custom Mini-Interpreter (Tokenizer, Parser, Evaluator)
 * ============================================================================
 * Key OOP Principles Demonstrated:
 * 1. Single Responsibility Principle (SRP):
 *    - Tokenizer: Lexical analysis (string -> tokens).
 *    - Parser: Syntactic analysis (tokens -> Abstract Syntax Tree).
 *    - Evaluator: Semantic execution (AST -> evaluated result).
 * 2. Encapsulation: Internal cursor positions and token streams are strictly private.
 * 3. Polymorphism / Class Invariants: Custom error hierarchy and structured AST representations.
 * 4. Safety: Absolutely NO eval() or Function() constructor is used.
 */

// Custom Exception Classes for structured error handling
export class InterpreterError extends Error {
  constructor(message: string, public position?: number) {
    super(message);
    this.name = 'InterpreterError';
  }
}

export class LexicalError extends InterpreterError {
  constructor(message: string, position?: number) {
    super(`[Lexical Error at pos ${position ?? 'unknown'}]: ${message}`, position);
    this.name = 'LexicalError';
  }
}

export class SyntaxError extends InterpreterError {
  constructor(message: string, position?: number) {
    super(`[Syntax Error at pos ${position ?? 'unknown'}]: ${message}`, position);
    this.name = 'SyntaxError';
  }
}

export class RuntimeError extends InterpreterError {
  constructor(message: string, position?: number) {
    super(`[Runtime Error]: ${message}`, position);
    this.name = 'RuntimeError';
  }
}

/**
 * Class 1: Tokenizer (Lexical Analyzer)
 * Converts raw source text into a sequential stream of tokens.
 */
export class Tokenizer {
  private source: string;
  private cursor: number = 0;
  private readonly length: number;

  constructor(source: string) {
    this.source = source.trim();
    this.length = this.source.length;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.cursor < this.length) {
      const char = this.source[this.cursor];

      // 1. Skip whitespace
      if (/\s/.test(char)) {
        this.cursor++;
        continue;
      }

      // 2. Syntax punctuation: Parentheses and commas
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: '(', position: this.cursor });
        this.cursor++;
        continue;
      }
      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: ')', position: this.cursor });
        this.cursor++;
        continue;
      }
      if (char === ',') {
        tokens.push({ type: 'COMMA', value: ',', position: this.cursor });
        this.cursor++;
        continue;
      }

      // 3. Number Literals (supports negatives and decimals, e.g. -5, 3.14)
      if (this.isDigitOrSign(char)) {
        const startPos = this.cursor;
        const numStr = this.readNumber();
        tokens.push({ type: 'NUMBER', value: numStr, position: startPos });
        continue;
      }

      // 4. Identifiers (Commands, Booleans, Strings)
      if (/[a-zA-Z_]/.test(char)) {
        const startPos = this.cursor;
        const ident = this.readIdentifier();
        const upper = ident.toUpperCase();

        if (upper === 'TRUE' || upper === 'FALSE') {
          tokens.push({ type: 'BOOLEAN', value: upper, position: startPos });
        } else if (this.isCommand(upper)) {
          tokens.push({ type: 'COMMAND', value: upper, position: startPos });
        } else {
          // General string/identifier token
          tokens.push({ type: 'STRING', value: ident, position: startPos });
        }
        continue;
      }

      // 5. Quoted String Literals: "hello world"
      if (char === '"' || char === "'") {
        const startPos = this.cursor;
        const strVal = this.readQuotedString(char);
        tokens.push({ type: 'STRING', value: strVal, position: startPos });
        continue;
      }

      throw new LexicalError(`Unexpected character '${char}'`, this.cursor);
    }

    tokens.push({ type: 'EOF', value: '<EOF>', position: this.cursor });
    return tokens;
  }

  private isDigitOrSign(char: string): boolean {
    if (/\d/.test(char)) return true;
    if (char === '-' || char === '+') {
      const next = this.source[this.cursor + 1];
      return next !== undefined && /\d/.test(next);
    }
    return false;
  }

  private readNumber(): string {
    const start = this.cursor;
    if (this.source[this.cursor] === '-' || this.source[this.cursor] === '+') {
      this.cursor++;
    }

    let hasDot = false;
    while (this.cursor < this.length) {
      const c = this.source[this.cursor];
      if (/\d/.test(c)) {
        this.cursor++;
      } else if (c === '.' && !hasDot) {
        hasDot = true;
        this.cursor++;
      } else {
        break;
      }
    }
    return this.source.slice(start, this.cursor);
  }

  private readIdentifier(): string {
    const start = this.cursor;
    while (this.cursor < this.length && /[a-zA-Z0-9_]/.test(this.source[this.cursor])) {
      this.cursor++;
    }
    return this.source.slice(start, this.cursor);
  }

  private readQuotedString(quoteChar: string): string {
    this.cursor++; // Skip opening quote
    const start = this.cursor;
    while (this.cursor < this.length && this.source[this.cursor] !== quoteChar) {
      this.cursor++;
    }
    if (this.cursor >= this.length) {
      throw new LexicalError('Unterminated string literal', start);
    }
    const val = this.source.slice(start, this.cursor);
    this.cursor++; // Skip closing quote
    return val;
  }

  private isCommand(val: string): boolean {
    const knownCommands = [
      'ADD',
      'SUB',
      'MUL',
      'DIV',
      'STUDY_HOURS',
      'PROGRESS',
      'AVERAGE',
      'PASS',
      'ELIGIBLE',
      'SUM',
      'HELP',
    ];
    return knownCommands.includes(val);
  }
}

/**
 * Class 2: Parser (Syntactic Analyzer)
 * Transforms the linear token array into an Abstract Syntax Tree (AST).
 * Supports both functional syntax: COMMAND(arg1, arg2)
 * and prefix CLI syntax: COMMAND arg1 arg2
 */
export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ASTNode {
    if (this.isAtEnd()) {
      throw new SyntaxError('Empty expression. Please enter a command (e.g., ADD 10 20).', 0);
    }

    const firstToken = this.peek();

    if (firstToken.type !== 'COMMAND') {
      throw new SyntaxError(
        `Expected a valid command at start, but received "${firstToken.value}" (${firstToken.type}). Try: ADD, SUB, MUL, DIV, STUDY_HOURS, PROGRESS, AVERAGE, PASS, ELIGIBLE, or HELP.`,
        firstToken.position
      );
    }

    const commandToken = this.advance();
    const commandName = commandToken.value;
    const args: ASTNode[] = [];

    // Check if following token is opening parenthesis '(' for functional style
    let hasParentheses = false;
    if (this.match('LPAREN')) {
      hasParentheses = true;
    }

    // Parse arguments until closing paren or EOF
    while (!this.isAtEnd()) {
      if (hasParentheses && this.peek().type === 'RPAREN') {
        this.advance(); // consume ')'
        hasParentheses = false;
        break;
      }

      // Ignore optional commas between arguments
      if (this.match('COMMA')) {
        continue;
      }

      const argNode = this.parseArgument();
      args.push(argNode);

      // Handle comma after argument if present
      if (this.match('COMMA')) {
        continue;
      }
    }

    if (hasParentheses) {
      throw new SyntaxError(`Missing closing parenthesis ')' for command ${commandName}.`, commandToken.position);
    }

    return {
      type: 'CommandExpression',
      command: commandName,
      args,
      position: commandToken.position,
    };
  }

  private parseArgument(): ASTNode {
    const token = this.peek();

    if (token.type === 'NUMBER') {
      this.advance();
      const numVal = parseFloat(token.value);
      if (isNaN(numVal)) {
        throw new SyntaxError(`Invalid numeric literal "${token.value}"`, token.position);
      }
      return {
        type: 'NumberLiteral',
        value: numVal,
        position: token.position,
      };
    }

    if (token.type === 'BOOLEAN') {
      this.advance();
      return {
        type: 'BooleanLiteral',
        value: token.value === 'TRUE',
        position: token.position,
      };
    }

    if (token.type === 'STRING') {
      this.advance();
      return {
        type: 'StringLiteral',
        value: token.value,
        position: token.position,
      };
    }

    // Nested command expression support
    if (token.type === 'COMMAND') {
      const subParser = new Parser(this.tokens.slice(this.current));
      const subAST = subParser.parse();
      // Advance this parser's current position to after the sub-expression
      this.current += (subAST.args?.length || 0) + 1;
      return subAST;
    }

    throw new SyntaxError(
      `Unexpected token "${token.value}" of type ${token.type} encountered where argument was expected.`,
      token.position
    );
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private peek(): Token {
    return this.tokens[this.current] || { type: 'EOF', value: '<EOF>', position: -1 };
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }
}

/**
 * Class 3: Evaluator (Semantic Execution Engine)
 * Takes an AST node and evaluates it according to CSCI 310 language semantics.
 */
export class Evaluator {
  public evaluate(node: ASTNode): { output: string | number | boolean; formatted: string } {
    if (node.type !== 'CommandExpression' || !node.command) {
      throw new RuntimeError(`Invalid AST root node type: ${node.type}`);
    }

    const command = node.command.toUpperCase();
    const evaluatedArgs = (node.args || []).map((arg) => this.evaluateNode(arg));

    switch (command) {
      case 'ADD':
        return this.evalAdd(evaluatedArgs);
      case 'SUB':
        return this.evalSub(evaluatedArgs);
      case 'MUL':
        return this.evalMul(evaluatedArgs);
      case 'DIV':
        return this.evalDiv(evaluatedArgs);
      case 'STUDY_HOURS':
        return this.evalStudyHours(evaluatedArgs);
      case 'PROGRESS':
        return this.evalProgress(evaluatedArgs);
      case 'AVERAGE':
        return this.evalAverage(evaluatedArgs);
      case 'PASS':
        return this.evalPass(evaluatedArgs);
      case 'ELIGIBLE':
        return this.evalEligible(evaluatedArgs);
      case 'SUM':
        return this.evalSum(evaluatedArgs);
      case 'HELP':
        return this.evalHelp();
      default:
        throw new RuntimeError(`Unrecognized command "${command}". Type HELP to see supported commands.`);
    }
  }

  private evaluateNode(node: ASTNode): string | number | boolean {
    if (node.type === 'NumberLiteral') return node.value as number;
    if (node.type === 'BooleanLiteral') return node.value as boolean;
    if (node.type === 'StringLiteral') return node.value as string;
    if (node.type === 'CommandExpression') {
      const res = this.evaluate(node);
      return res.output;
    }
    throw new RuntimeError(`Unknown node type "${node.type}" in argument list.`);
  }

  // --- Command Implementations ---

  private evalAdd(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length !== 2) {
      throw new RuntimeError(`ADD requires exactly 2 numeric arguments. Received: ${args.length}. (Example: ADD 10 20)`);
    }
    const [a, b] = this.assertNumbers(args, 'ADD');
    const result = a + b;
    return { output: result, formatted: `${result}` };
  }

  private evalSub(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length !== 2) {
      throw new RuntimeError(`SUB requires exactly 2 numeric arguments. Received: ${args.length}. (Example: SUB 20 5)`);
    }
    const [a, b] = this.assertNumbers(args, 'SUB');
    const result = a - b;
    return { output: result, formatted: `${result}` };
  }

  private evalMul(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length !== 2) {
      throw new RuntimeError(`MUL requires exactly 2 numeric arguments. Received: ${args.length}. (Example: MUL 4 5)`);
    }
    const [a, b] = this.assertNumbers(args, 'MUL');
    const result = a * b;
    return { output: result, formatted: `${result}` };
  }

  private evalDiv(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length !== 2) {
      throw new RuntimeError(`DIV requires exactly 2 numeric arguments. Received: ${args.length}. (Example: DIV 20 4)`);
    }
    const [a, b] = this.assertNumbers(args, 'DIV');
    if (b === 0) {
      throw new RuntimeError('Division by zero error: The denominator cannot be 0.');
    }
    const result = a / b;
    return { 
      output: Number.isInteger(result) ? result : parseFloat(result.toFixed(4)), 
      formatted: `${Number.isInteger(result) ? result : parseFloat(result.toFixed(4))}` 
    };
  }

  private evalStudyHours(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length === 0) {
      throw new RuntimeError('STUDY_HOURS requires at least one minute duration. (Example: STUDY_HOURS 120 60 30)');
    }
    const nums = this.assertNumbers(args, 'STUDY_HOURS');
    for (const n of nums) {
      if (n < 0) throw new RuntimeError(`STUDY_HOURS arguments cannot be negative. Received ${n}.`);
    }
    const totalMinutes = nums.reduce((sum, n) => sum + n, 0);
    const hours = totalMinutes / 60;
    const formattedHours = Number.isInteger(hours) ? `${hours} hours` : `${parseFloat(hours.toFixed(2))} hours`;
    return { output: parseFloat(hours.toFixed(2)), formatted: formattedHours };
  }

  private evalProgress(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length !== 2) {
      throw new RuntimeError(`PROGRESS requires exactly 2 arguments: (completed, total). Received: ${args.length}. (Example: PROGRESS 8 10)`);
    }
    const [completed, total] = this.assertNumbers(args, 'PROGRESS');
    if (total <= 0) {
      throw new RuntimeError('PROGRESS total count must be greater than zero.');
    }
    if (completed < 0) {
      throw new RuntimeError('PROGRESS completed count cannot be negative.');
    }
    const percentage = Math.round((completed / total) * 100);
    return { output: percentage, formatted: `${percentage}%` };
  }

  private evalAverage(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length === 0) {
      throw new RuntimeError('AVERAGE requires at least one numeric argument. (Example: AVERAGE 80 70 90)');
    }
    const nums = this.assertNumbers(args, 'AVERAGE');
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / nums.length;
    const cleanAvg = Number.isInteger(avg) ? avg : parseFloat(avg.toFixed(2));
    return { output: cleanAvg, formatted: `${cleanAvg}` };
  }

  private evalPass(args: (string | number | boolean)[]): { output: boolean; formatted: string } {
    if (args.length < 1 || args.length > 2) {
      throw new RuntimeError('PASS requires 1 or 2 arguments: PASS score [threshold=50]. (Example: PASS 65)');
    }
    const score = Number(args[0]);
    const threshold = args.length === 2 ? Number(args[1]) : 50;

    if (isNaN(score) || isNaN(threshold)) {
      throw new RuntimeError('PASS arguments must be valid numbers.');
    }

    const passed = score >= threshold;
    return { output: passed, formatted: passed ? 'True' : 'False' };
  }

  private evalEligible(args: (string | number | boolean)[]): { output: boolean; formatted: string } {
    if (args.length !== 2) {
      throw new RuntimeError('ELIGIBLE requires 2 arguments: ELIGIBLE attendance_percent passing_status. (Example: ELIGIBLE 45 TRUE)');
    }
    const attendance = Number(args[0]);
    if (isNaN(attendance)) {
      throw new RuntimeError('ELIGIBLE first argument (attendance) must be a number.');
    }

    let status = false;
    if (typeof args[1] === 'boolean') {
      status = args[1];
    } else {
      const sStr = String(args[1]).toUpperCase();
      status = sStr === 'TRUE' || sStr === '1';
    }

    // Eligibility business rule: attendance >= 40 and status is true
    const eligible = attendance >= 40 && status;
    return { output: eligible, formatted: eligible ? 'True' : 'False' };
  }

  private evalSum(args: (string | number | boolean)[]): { output: number; formatted: string } {
    if (args.length === 0) {
      throw new RuntimeError('SUM requires at least one number. (Example: SUM 10 20 30)');
    }
    const nums = this.assertNumbers(args, 'SUM');
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    return { output: sum, formatted: `${sum}` };
  }

  private evalHelp(): { output: string; formatted: string } {
    const text = `Available Commands:
• ADD a b: Addition (e.g., ADD 10 20 -> 30)
• SUB a b: Subtraction (e.g., SUB 20 5 -> 15)
• MUL a b: Multiplication (e.g., MUL 4 5 -> 20)
• DIV a b: Division (e.g., DIV 20 4 -> 5)
• STUDY_HOURS m1 m2...: Convert minute durations to hours (e.g., STUDY_HOURS 120 60 30 -> 3.5 hours)
• PROGRESS done total: Calculate completion percentage (e.g., PROGRESS 8 10 -> 80%)
• AVERAGE n1 n2...: Compute arithmetic mean (e.g., AVERAGE 80 70 90 -> 80)
• PASS score [min=50]: Check passing grade (e.g., PASS 65 -> True)
• ELIGIBLE attendance pass_bool: Exam eligibility (e.g., ELIGIBLE 45 TRUE -> True)
• SUM n1 n2...: Total of multiple numbers`;
    return { output: text, formatted: text };
  }

  private assertNumbers(args: (string | number | boolean)[], cmdName: string): number[] {
    return args.map((arg, idx) => {
      const num = Number(arg);
      if (isNaN(num)) {
        throw new RuntimeError(`Argument ${idx + 1} for ${cmdName} must be a number, received: "${arg}"`);
      }
      return num;
    });
  }
}

/**
 * Main Facade Class: Interpreter
 * Integrates Tokenizer, Parser, and Evaluator with execution performance telemetry.
 */
export class Interpreter {
  public static execute(input: string): InterpreterResult {
    const startTime = performance.now();
    const trimmed = input.trim();

    if (!trimmed) {
      return {
        success: false,
        input,
        formattedOutput: '',
        error: 'Input expression is empty. Try: ADD 10 20 or HELP',
        tokens: [],
        executionTimeMs: 0,
        timestamp: new Date().toLocaleTimeString(),
      };
    }

    try {
      // Step 1: Lexical Analysis
      const tokenizer = new Tokenizer(trimmed);
      const tokens = tokenizer.tokenize();

      // Step 2: Syntactic Analysis
      const parser = new Parser(tokens);
      const ast = parser.parse();

      // Step 3: Semantic Evaluation
      const evaluator = new Evaluator();
      const { output, formatted } = evaluator.evaluate(ast);

      const endTime = performance.now();

      return {
        success: true,
        input: trimmed,
        output,
        formattedOutput: formatted,
        tokens,
        ast,
        commandName: ast.command,
        executionTimeMs: parseFloat((endTime - startTime).toFixed(3)),
        timestamp: new Date().toLocaleTimeString(),
      };
    } catch (err: unknown) {
      const endTime = performance.now();
      const errorMessage = err instanceof Error ? err.message : String(err);

      return {
        success: false,
        input: trimmed,
        formattedOutput: '',
        error: errorMessage,
        tokens: [],
        executionTimeMs: parseFloat((endTime - startTime).toFixed(3)),
        timestamp: new Date().toLocaleTimeString(),
      };
    }
  }

  public static getCommandDocs(): CommandDoc[] {
    return [
      {
        name: 'ADD',
        syntax: 'ADD <num1> <num2>',
        example: 'ADD 10 20',
        description: 'Computes arithmetic addition of two numeric arguments.',
        category: 'Math',
      },
      {
        name: 'SUB',
        syntax: 'SUB <num1> <num2>',
        example: 'SUB 20 5',
        description: 'Subtracts the second number from the first.',
        category: 'Math',
      },
      {
        name: 'MUL',
        syntax: 'MUL <num1> <num2>',
        example: 'MUL 4 5',
        description: 'Multiplies two numbers together.',
        category: 'Math',
      },
      {
        name: 'DIV',
        syntax: 'DIV <numerator> <denominator>',
        example: 'DIV 20 4',
        description: 'Divides numerator by denominator. Protects against zero division.',
        category: 'Math',
      },
      {
        name: 'STUDY_HOURS',
        syntax: 'STUDY_HOURS <min1> [min2] ...',
        example: 'STUDY_HOURS 120 60 30',
        description: 'Sums study session durations in minutes and converts to formatted hours.',
        category: 'Study Metrics',
      },
      {
        name: 'PROGRESS',
        syntax: 'PROGRESS <completed> <total>',
        example: 'PROGRESS 8 10',
        description: 'Calculates the completion percentage ratio for study tasks.',
        category: 'Study Metrics',
      },
      {
        name: 'AVERAGE',
        syntax: 'AVERAGE <num1> <num2> ...',
        example: 'AVERAGE(80, 70, 90)',
        description: 'Calculates the arithmetic average of grades or study hours.',
        category: 'Study Metrics',
      },
      {
        name: 'PASS',
        syntax: 'PASS <score> [threshold=50]',
        example: 'PASS(65)',
        description: 'Evaluates whether a score meets the minimum passing threshold.',
        category: 'Grading Logic',
      },
      {
        name: 'ELIGIBLE',
        syntax: 'ELIGIBLE <attendance> <pass_status>',
        example: 'ELIGIBLE(45, TRUE)',
        description: 'Evaluates university exam eligibility based on attendance and course standing.',
        category: 'Grading Logic',
      },
      {
        name: 'SUM',
        syntax: 'SUM <num1> <num2> ...',
        example: 'SUM 15 25 35',
        description: 'Computes the total sum of any number of numeric inputs.',
        category: 'Math',
      },
    ];
  }
}
