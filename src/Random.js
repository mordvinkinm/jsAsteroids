var Random = {
    randRange: function (from, to) {
        return (to - from) * Math.random() + from;
    },

    random: Math.random
};