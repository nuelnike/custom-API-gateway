module.exports = () => { 
	
	const Sequelize = require('sequelize');

	const tbl:string = "session";
	const structure:any = {
		// id: {
		// 	type: Sequelize.INTEGER,
		// 	primaryKey: true,
		// 	allowNull: false,
		// 	autoIncrement: true
		// },
		token: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false,
		}, 
		user_id: {
			type: Sequelize.STRING,
		},
		status_id: {
			type: Sequelize.INTEGER,
			allowNull: true,
		},
		duration: {
			type: Sequelize.STRING,
			allowNull: true, 
		},
		created_at: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		},
		updated_at: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW
		}
	};
	const spec:any = {
		underscored: true,
		tableName: 'session',
		name: {
			singular: 'session',
			plural: 'sessions'		
		},
		freezeTableName: true
	};

	return {tbl, structure, spec};
}