import { GlobalStyle, Page } from "../_styles";
import Header from "./_components/Header";
import FeedList from "./_components/FeedList";
import BottomNav from "../_components/BottomNav";

export const metadata = { title: "클립" };

export default function ClipPage() {
  return (
    <Page>
      <GlobalStyle />
      <div style={{ padding: 0, paddingTop: 56, paddingBottom: 72, display: "flex", flexDirection: "column", gap: 12 }}>
        <Header />
        <FeedList />
      </div>
      <BottomNav current="clip" />
    </Page>
  );
}


