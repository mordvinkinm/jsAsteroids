var Random = {
    randRange: function (from, to) {
        var tmp = parseInt((to - from) * Math.random() + from);
        return tmp == to ? tmp - 1 : parseInt(tmp);
    },

    random: Math.random
};