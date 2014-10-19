module.exports = function( _poolSize ) {

    var poolSize = _poolSize || 5;

    this.getPoolSize = function() {
        return poolSize;
    };
}