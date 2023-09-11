module.exports = () => { 
	
	const Sequelize = require('sequelize');

	const tbl:string = "status";
	const structure:any = {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		}, 
		name: {
			type: Sequelize.STRING,
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
		tableName: 'status',
		name: {
			singular: 'status',
			plural: 'statuses'		
		},
		freezeTableName: true
	};

	return {tbl, structure, spec};
}