from psycopg2.extras import RealDictCursor
import database_connection

@database_connection.connection_handler
def get_user_id(cursor, token):
    cursor.execute(""" SELECT users.id FROM users
                        WHERE users.token =%(token)s""",
                   {
                       "token": token
                       })
    user_sql = cursor.fetchone()
    return "0" if user_sql is None else str(user_sql['id'])


@database_connection.connection_handler
def get_rolename(cursor, user_id):
    cursor.execute(""" SELECT roles.rolename FROM roles
                        WHERE roles.userid = %(user_id)s""",
                   {
                       "user_id": user_id
                       })
    roles_sql = cursor.fetchone()
    return "public" if roles_sql is None else roles_sql['rolename']