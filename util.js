/**
 * Created with JetBrains PhpStorm.
 * User: xuyifei
 * Date: 13-10-29
 * Time: 上午10:19
 * To change this template use File | Settings | File Templates.
 */
Array.prototype.unique = function () {
    var results  = this.sort();
    for ( var i = 1; i < results.length;i++) {
       if (results[i] === results[i-1]) {
           results.splice(i--,1);
       }
    }
    return results;
}