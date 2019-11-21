module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Registrations', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Plans', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('Registrations');
  },
};
