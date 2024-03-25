"use client";

import ReactTimeago from "react-timeago";

const TimeAgoText = ({ date }: { date: string }) => {
  return (
    <ReactTimeago date={date} />
  )
}

export default TimeAgoText