export const UserResponseSchema = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				username: { type: 'string', description: "User's username", example: 'testusername' },
				email: { type: 'string', description: "User's email address", example: 'test@gmail.com' },
				id: { type: 'integer', format: 'int64', description: 'Unique identifier of the user', example: 5 },
				bio: { type: 'string', description: 'Short bio of the user', example: "I love programming!" },
				image: { type: 'string', description: 'URL of the user\'s profile image', example: 'https://example.com/user123.jpg' },
				password: { type: 'string', description: "User's hashed password", example: "$2b$10$InfiI2K8PbLvEDkIUPteu..UEeIfFoahIE3WFs5F4K3QDo2qSqxdi" },
				token: { type: 'string', description: 'Authentication token for the user JSON WEB TOKEN', example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJWYWR5bTEzIiwiZW1haWwiOiJwZXluY3cxM0BnbWFpbC5jb20iLCJpYXQiOjE2OTAyNzY3Mzh9.kWNkxA_7a6zIb1ijZboYyV7Buj1F5mc3nRkANO0V96I" },
			},
		},
	},
};
