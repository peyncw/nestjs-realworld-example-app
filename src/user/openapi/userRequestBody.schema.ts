export const UserRequestBody = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				username: { type: 'string', minLength: 1 }, // minLength added to enforce non-empty string
				email: { type: 'string', format: 'email' }, // format added to ensure it's a valid email
				password: { type: 'string', minLength: 6 }, // minLength added for a minimum password length
			},
			required: ['username', 'email', 'password'], // added to indicate these properties are required
		},
	},
	required: ['user'], // added to indicate the 'user' object is required in the request body
}