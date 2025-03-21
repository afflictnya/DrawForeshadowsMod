Events.on(ClientLoadEvent, h => {
    const range = Blocks.foreshadow.range
    Vars.ui.settings.addCategory("Draw Foreshadows", new TextureRegionDrawable(Blocks.foreshadow.fullIcon), table => {
        table.checkPref("Draw foreshadows range", true, ch => {
            Core.settings.put("drawforeshadrange", ch)
        })
        table.checkPref("Draw only enemy turrets", true, ch => {
            Core.settings.put("onlyenemyturrets", ch)
        })
    })
    Events.run(Trigger.draw, () => {
        if (Core.settings.getBool("drawforeshadrange", true)) {
            let bounds = Core.camera.bounds(Tmp.r1).grow(Vars.tilesize)
            Groups.build.each(build => {
                if (build.block == Blocks.foreshadow) {
                    if (!visible(bounds, build.x, build.y, range)) {
                        return;
                    }
                    let color;
                    if (build.team == Vars.player.team()) {
                        if (Core.settings.getBool("onlyenemyturrets", true)) {
                            return;
                        }               
                        color = Color.green;
                    } else {
                        color = Color.red;
                    }
                    Drawf.dashCircle(build.x, build.y, range, color)
                }
            })
        }
    })
})

function visible(bounds, cx, cy, rad) {
    let dx = cx - Math.max(bounds.x, Math.min(cx, bounds.x + bounds.width));
    let dy = cy - Math.max(bounds.y, Math.min(cy, bounds.y + bounds.height));
    return (dx * dx + dy * dy) <= rad * rad;
}