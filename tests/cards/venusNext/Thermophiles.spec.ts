import {expect} from 'chai';
import {cast, churnAction, runAllActions} from '../../TestingUtils';
import {Thermophiles} from '../../../src/server/cards/venusNext/Thermophiles';
import {VenusianInsects} from '../../../src/server/cards/venusNext/VenusianInsects';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';

describe('Thermophiles', function() {
  let card: Thermophiles;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Thermophiles();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    (game as any).venusScaleLevel = 4;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).venusScaleLevel = 6;
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should act - multiple targets', function() {
    card.play(player);
    player.playedCards.push(card, new VenusianInsects());

    card.action(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard);
    action.cb([card]);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card);

    const orOptions = cast(churnAction(card, player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });

  it('Should act - single target', function() {
    card.play(player);
    player.playedCards.push(card);

    const action = card.action(player);
    expect(action).is.undefined;
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);

    player.addResourceTo(card);

    const orOptions = cast(churnAction(card, player), OrOptions);
    orOptions.options[0].cb();
    expect(card.resourceCount).to.eq(0);
    expect(game.getVenusScaleLevel()).to.eq(2);
  });
});
