export type TokenType =
  | 'COMMAND'
  | 'NUMBER'
  | 'BOOLEAN'
  | 'STRING'
  | 'COMMA'
  | 'LPAREN'
  | 'RPAREN'
  | 'EOF'
  | 'UNKNOWN';

export interface Token {
  type: TokenType;
  value: string;
  position: number;
}

export type ASTNodeType =
  | 'CommandExpression'
  | 'NumberLiteral'
  | 'BooleanLiteral'
  | 'StringLiteral';

export interface ASTNode {
  type: ASTNodeType;
  value?: string | number | boolean;
  command?: string;
  args?: ASTNode[];
  position?: number;
}

export interface InterpreterResult {
  success: boolean;
  input: string;
  output?: string | number | boolean;
  formattedOutput: string;
  error?: string;
  tokens: Token[];
  ast?: ASTNode;
  executionTimeMs: number;
  timestamp: string;
  commandName?: string;
}

export interface CommandDoc {
  name: string;
  syntax: string;
  example: string;
  description: string;
  category: 'Math' | 'Study Metrics' | 'Grading Logic';
}
