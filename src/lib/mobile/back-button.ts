// Android back button. Go back in the WebView while there is history to go back to. Otherwise leave the app.
export type BackAction = "back" | "exit";

export function decideBackAction(historyLength: number): BackAction {
  return historyLength > 1 ? "back" : "exit";
}
