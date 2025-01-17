// @flow
import React from 'react';
import TotalBackground from './total-background.png';
import useTween from 'util/use-tween';

type Props = {
  rewards: Array<Reward>,
};

function RewardTotal(props: Props) {
  const { rewards } = props;
  const rewardTotal = rewards.reduce((acc, val) => acc + val.reward_amount, 0);
  const total = useTween(rewardTotal * 25);
  const integer = Math.round(total * rewardTotal);

  return (
    <section className="card  card--section card--reward-total" style={{ backgroundImage: `url(${TotalBackground})` }}>
      <span className="card__title">
        {integer} LBC {__('Earned From Rewards')}
      </span>
    </section>
  );
}

export default RewardTotal;
