# fussball-de-matchplan-grabber
A match plan grabber for [fussball.de][0]

# Installation

## Arch Linux / Antergos
    sudo pacman -S nodejs npm git
    git clone https://github.com/BuZZ-dEE/fussball-de-matchplan-grabber.git
    cd fussball-de-matchplan-grabber
    sudo npm install -g

# Usage
    fussball-de-matchplan-grabber --team URL_TO_TEAM_NEXT_GAMES

e.g.

    fussball-de-matchplan-grabber --team http://www.fussball.de/ajax.team.next.games/-/team-id/01S687UBF8000000VS548985VUL18RL3

[0]: http://www.fussball.de/
