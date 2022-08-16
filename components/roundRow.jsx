export default function RoundRow({
  round,
  currentRound,
  index,
  roundBids,
  roundGets,
  roundScores,
  bidsDone,
  handleBidsDone,
  handleGetsDone,
  handleBidsChange,
  handleGetsChange,
  errorMessage,
  cumulativeScores,
  handleUndo,
}) {
  if (index < currentRound) {
    return (
      <tr className="flex divide-x divide-black text-center">
        <td className="flex w-9 text-left whitespace-nowrap py-1">
          <p>
            {round.hands} {round.suit}
          </p>
        </td>
        {roundBids.map((r, j) => (
          <td
            key={j}
            className={
              'px-1 py-1 w-16 ' +
              (roundBids[j] === roundGets[j] ? 'bg-green-500' : 'bg-red-500')
            }
          >
            <p className="whitespace-nowrap text-center">
              <span className={''}>{cumulativeScores[j]}</span> {roundGets[j]}/
              {roundBids[j]}
            </p>
          </td>
        ))}
        <td className="flex w-16"></td>
      </tr>
    );
  } else if (index === currentRound) {
    return (
      <tr className="flex divide-x divide-black text-center">
        <td className="flex whitespace-nowrap w-9 py-1">
          {round.hands} {round.suit}
        </td>
        {roundBids.map((bid, index) =>
          bidsDone ? (
            <td key={index} className="flex w-16">
              <div className="flex w-full space-x-0.5 px-0.5 items-center">
                <button
                  onClick={() => handleGetsChange('+', index)}
                  className="border border-black rounded-lg w-full"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleGetsChange('-', index)}
                  className="border border-black rounded-lg w-full"
                >
                  ↓
                </button>
                <p>
                  {roundGets[index]}/{bid}
                </p>
              </div>
            </td>
          ) : (
            <td key={index} className="flex w-16">
              <div className="flex w-full items-center space-x-1 px-1">
                <p className="">{bid}</p>
                <button
                  onClick={() => handleBidsChange('+', index)}
                  className="border border-black rounded-lg w-full"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleBidsChange('-', index)}
                  className="border border-black rounded-lg w-full"
                >
                  ↓
                </button>
              </div>
            </td>
          )
        )}
        <td className="flex w-18">
          <div className="flex flex-col justify-start items-start space-y-1">
            {bidsDone ? (
              <button
                onClick={() => handleGetsDone()}
                className="border border-black rounded-lg text-xs p-1"
              >
                Gets Done
              </button>
            ) : (
              <button
                onClick={() => handleBidsDone()}
                className="border border-black rounded-lg text-xs p-1"
              >
                Bids Done
              </button>
            )}
            <button
              onClick={() => handleUndo()}
              className="border border-black rounded-lg text-xs p-1"
            >
              {' '}
              Undo{' '}
            </button>
            {/* <p className="">{errorMessage}</p> */}
          </div>
        </td>
      </tr>
    );
  } else {
    return (
      <tr className="divide-x divide-black flex h-8">
        <td className="flex w-9 text-left whitespace-nowrap py-1">
          {round.hands} {round.suit}
        </td>
        {roundBids.map((bid, index) => (
          <td className="w-16" key={index}></td>
        ))}
        <td className="w-20"></td>
      </tr>
    );
  }
}
