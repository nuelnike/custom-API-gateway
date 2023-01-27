module.exports = () => { 
	
	const Sequelize = require('sequelize'); 

	const tbl:string = "users";
	const structure:any = {
		id: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},    
		city_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		state_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},
		country_id: {
			type: Sequelize.INTEGER,
			allowNull: true, 
		},  
		username: {
			type: Sequelize.STRING,
			uniqueKey: true
		}, 
		surname: {
			type: Sequelize.STRING
		},
		firstname: {
			type: Sequelize.STRING
		},
		othername: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING,
			uniqueKey: true
		},
		phone: {
			type: Sequelize.STRING
		},
		password: {
			type: Sequelize.STRING
		},
		photo: {
			type: Sequelize.STRING
		},
		address: {
			type: Sequelize.STRING
		},
		gender: {
			type: Sequelize.STRING
		},
		dob: {
			type: Sequelize.STRING
		},
		created_at: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		updated_at: {
			type: Sequelize.DATE,
			// defaultValue: Sequelize.NOW
		}
	};
	const spec:any = {
		underscored: true,
		tableName: 'users',
		name: {
			singular: 'user',
			plural: 'users'		
		},
		freezeTableName: true
	};

	return {tbl, structure, spec};
}