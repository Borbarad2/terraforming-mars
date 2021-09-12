import {expect} from 'chai';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {InterstellarColonyShip} from '../../../src/cards/base/InterstellarColonyShip';
import {Research} from '../../../src/cards/base/Research';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';

describe('InterstellarColonyShip', function() {
  let card : InterstellarColonyShip; let player : TestPlayer;

  beforeEach(function() {
    card = new InterstellarColonyShip();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayForFree(card)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(new Research(), new Research(), new GeneRepair());
    expect(player.canPlayForFree(card)).is.true;

    card.play(player);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(4);
  });
});
