export const UserRequestBodyLogin = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				email: { type: 'string', format: 'email' }, // format added to ensure it's a valid email
				password: { type: 'string', minLength: 6 }, // minLength added for a minimum password length
			},
			required: ['email', 'password'], // added to indicate these properties are required
		},
	},
	required: ['user'], // added to indicate the 'user' object is required in the request body
}