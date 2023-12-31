import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'movies',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'shows',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          { name: 'movie_id', type: 'uuid' },
          { name: 'start_time', type: 'timestamp' },
        ],
        foreignKeys: [
          {
            columnNames: ['movie_id'],
            referencedTableName: 'movies',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'cinemas',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'showrooms',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          { name: 'cinema_id', type: 'uuid' },
          { name: 'name', type: 'varchar' },
        ],
        foreignKeys: [
          {
            columnNames: ['cinema_id'],
            referencedTableName: 'cinemas',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'pricing',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          { name: 'show_id', type: 'uuid' },
          { name: 'seat_type', type: 'varchar' },
          { name: 'price', type: 'decimal' },
        ],
        foreignKeys: [
          {
            columnNames: ['show_id'],
            referencedTableName: 'shows',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'seats',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'increment',
          },
          { name: 'show_id', type: 'uuid' },
          { name: 'room_id', type: 'uuid' },
          { name: 'seat_number', type: 'integer' },
          { name: 'seat_type', type: 'varchar' },
          { name: 'is_booked', type: 'boolean', default: false },
        ],
        foreignKeys: [
          {
            columnNames: ['show_id'],
            referencedTableName: 'shows',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['room_id'],
            referencedTableName: 'showrooms',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('seats');
    await queryRunner.dropTable('pricing');
    await queryRunner.dropTable('showrooms');
    await queryRunner.dropTable('cinemas');
    await queryRunner.dropTable('shows');
    await queryRunner.dropTable('movies');
  }
}
