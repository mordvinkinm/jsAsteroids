var Helpers = {
    angle_to_vector: function (ang, r) {
        r = r ? r : 1;
        return {x: r * Math.cos(ang), y: r * Math.sin(ang)};
    },

    dist: function (p, q) {
        if (!q) q = {x: 0, y: 0};
        return Math.sqrt(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2));
    }
};