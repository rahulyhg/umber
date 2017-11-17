/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMysqlServer'
  // },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 8080,
  realHost: "http://umber.wohlig.co.in",
  emails: ["chintan@wohlig.com", "jagruti@wohlig.com", "tushar@wohlig.com", "harshad.shirsat@wohlig.com", "prajakta.kamble@wohlig.com", "chirag@wohlig.com", "harsh@wohlig.com", "p.vasu@burntumberfashion.com", "kushbhatia@burntumberfashion.com","avinash.ghare@wohlig.com"]

  // port: 1337,
  // realHost: "http://104.197.111.0:1337",
  // emails: ["chintan@wohlig.com", "jagruti@wohlig.com", "tushar@wohlig.com", "harshad.shirsat@wohlig.com", "prajakta.kamble@wohlig.com", "chirag@wohlig.com", "harsh@wohlig.com", "p.vasu@burntumberfashion.com", "kushbhatia@burntumberfashion.com"]

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
