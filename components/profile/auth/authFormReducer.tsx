export const initialState = {
	email: 'testUser@gmail.com',
	password: '123456789Z',
	confirmPassword: '123456789Z',
};

export const actionType = {
	SET_EMAIL: 'SET_EMAIL',
	SET_PASSWORD: 'SET_PASSWORD',
	SET_CONFIRM_PASSWORD: 'SET_CONFIRM_PASSWORD',
	RESET: 'RESET',
};

export function formReducer(state: typeof initialState, action: { type: string; payload: string }) {
	switch (action.type) {
		case actionType.SET_EMAIL:
			return { ...state, email: action.payload };
		case actionType.SET_PASSWORD:
			return { ...state, password: action.payload };
		case actionType.SET_CONFIRM_PASSWORD:
			return { ...state, confirmPassword: action.payload };
		case actionType.RESET:
			return initialState;
		default:
			return state;
	}
}
