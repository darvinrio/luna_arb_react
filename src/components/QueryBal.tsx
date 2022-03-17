import { useConnectedWallet, useLCDClient } from '@terra-money/wallet-provider';

import React, { useEffect, useState } from 'react';

export function QuerySample() {
  const lcd = useLCDClient();
  const connectedWallet = useConnectedWallet();

  const [bank, setBank] = useState<null | number>();


  useEffect(() => {
    if (connectedWallet) {
      lcd.bank.balance(connectedWallet.walletAddress).then(([coins]) => {
        let luna_bal:string = (coins.get('uluna')?.amount.toString())!;
        setBank(parseInt(luna_bal)/Math.pow(10,6));
      });
    } else {
      setBank(null);
    }
  }, [connectedWallet, lcd]);

  return (
    <div>
      {bank+" LUNA"}
      {!connectedWallet && <p>Wallet not connected!</p>}
    </div>
  );
}