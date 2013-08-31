var Random = {
    randRange: function (from, to) {
        return (to - from) * Math.random() + from;
    },

    random: Math.random
};

function Size(width, height) {
    var self = this;

    self.Width = width;
    self.Height = height;
}

function Coordinates(x, y) {
    var self = this;

    self.X = x;
    self.Y = y;
}