export const UserRequestBodyUpdate = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				username: { type: 'string', minLength: 1 }, // minLength added to enforce non-empty string
				email: { type: 'string', format: 'email' }, // format added to ensure it's a valid email
				bio: { type: 'string', description: 'Short bio of the user', example: "I love programming!" },
				image: { type: 'string', description: 'URL of the user\'s profile image', example: 'https://example.com/user123.jpg' }
			}
		},
	}
}