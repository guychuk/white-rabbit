import { AState, DFA, NFA, Character, sameState, isAcceptingState } from "../typescript/automata.js"

const OUT_RAD = 40, IN_RAD = 35;
const TRANSITION_ARROW_HEAD_SIZE = 10;
const INIT_ARROW_LEN = 20, INIT_ARROW_PAD = 10, INIT_ARROW_HEAD_SIZE = 10;
const STATE_NAME_FONT = '20px Courier New';
const TRANSITION_FONT = 'bold 20px Courier New';
const TRANSITION_CHAR_PAD = 15;

// TODO: self transition

/**
 * draw a state in the automata diagram.
 * @param ctx canvas' context.
 * @param x the x coordinate of the center of the state's circle.
 * @param y the y coordinate of the center of the state's circle.
 * @param state the state.
 * @param dfa the entire dfa.
 */
function drawState(ctx: CanvasRenderingContext2D, x: number, y: number, state: AState, fa: DFA | NFA): void {
    // draw the outer circle
    ctx.beginPath();
    ctx.arc(x, y, OUT_RAD, 0, 2 * Math.PI);
    ctx.stroke();

    // write the state's name
    ctx.font = STATE_NAME_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.name, x, y);

    if (isAcceptingState(fa, state)) {
        // draw th inner circle
        ctx.beginPath();
        ctx.arc(x, y, IN_RAD, 0, 2 * Math.PI);
        ctx.stroke();
    }

    if (sameState(state, fa.initialState)) {
        // draw an arrow above the outer circle
        ctx.beginPath();
        ctx.moveTo(x, y - OUT_RAD - INIT_ARROW_PAD - INIT_ARROW_LEN);
        ctx.lineTo(x, y - OUT_RAD - INIT_ARROW_PAD);
        ctx.stroke();

        // draw the arrowhead
        ctx.beginPath();
        ctx.moveTo(x - INIT_ARROW_HEAD_SIZE * Math.cos(Math.PI / 3), 
            y - OUT_RAD - INIT_ARROW_PAD - INIT_ARROW_HEAD_SIZE * Math.sin(Math.PI / 3));
        ctx.lineTo(x + INIT_ARROW_HEAD_SIZE * Math.cos(Math.PI / 3), 
            y - OUT_RAD - INIT_ARROW_PAD - INIT_ARROW_HEAD_SIZE * Math.sin(Math.PI / 3));
        ctx.lineTo(x, y - OUT_RAD - INIT_ARROW_PAD);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * draw a transition (arrow) in the automata diagram.
 * @param ctx canvas' context.
 * @param x1 source state's circle x coordinate.
 * @param y1 source state's circle y coordinate.
 * @param x2 destination state's circle x coordinate.
 * @param y2 destination state's circle y coordinate.
 * @param char the char corresponding to the transition.
 */
function drawTransition(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, char: Character): void {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const startX = x1 + OUT_RAD * Math.cos(angle), startY = y1 + OUT_RAD * Math.sin(angle);
    const endX = x2 - OUT_RAD * Math.cos(angle), endY = y2 - OUT_RAD * Math.sin(angle);

    // draw the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // draw the head
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - TRANSITION_ARROW_HEAD_SIZE * Math.cos(angle - Math.PI / 6), 
        endY - TRANSITION_ARROW_HEAD_SIZE * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - TRANSITION_ARROW_HEAD_SIZE * Math.cos(angle + Math.PI / 6), 
        endY - TRANSITION_ARROW_HEAD_SIZE * Math.sin(angle + Math.PI / 6));
    ctx.stroke();

    // write the letter
    ctx.font = TRANSITION_FONT;

    if (char === '')
        ctx.fillText('ε', (startX + endX) / 2 - TRANSITION_CHAR_PAD, (startY + endY) / 2 - TRANSITION_CHAR_PAD);
    else
        ctx.fillText(char, (startX + endX) / 2 - TRANSITION_CHAR_PAD, (startY + endY) / 2 - TRANSITION_CHAR_PAD);
}

/**
 * calculate the position of each state's circle in the canvas.
 * @param canvas the canvas.
 * @param states a list of states.
 * @returns a list of positions: { state, x, y };
 */
function calculatePositions(canvas: HTMLCanvasElement, states: AState[]) {
    const centerX = canvas.width / 2, centerY = canvas.height / 2;
    const rotationPerState = (2 * Math.PI) / states.length;
    const radius = Math.min(canvas.width, canvas.height) / 2 - OUT_RAD;

    return states.map((state, index) => 
        ({ state: state, 
            x: centerX + radius * Math.cos(index * rotationPerState), 
            y: centerY + radius * Math.sin(index * rotationPerState)}));
}

/**
 * draw an entire DFA diagram.
 * @param dfa
 */
export function drawAutomata(fa: DFA | NFA, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
    const positions = calculatePositions(canvas, fa.states);

    positions.forEach(stateP => drawState(ctx, stateP.x, stateP.y, stateP.state, fa));
    
    fa.transitions.forEach(transiton => {
        const origin = positions.findIndex(pos => sameState(pos.state, transiton.src));
        const end = positions.findIndex(pos => sameState(pos.state, transiton.dest));

        if (origin === -1 || end === -1)
            throw new Error("invalid transitions")  // shouldn't happen

        drawTransition(ctx, 
            positions[origin].x, positions[origin].y, 
            positions[end].x, positions[end].y, 
            transiton.char);
    });
}
