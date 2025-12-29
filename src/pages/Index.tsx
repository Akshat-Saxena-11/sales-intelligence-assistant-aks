import { ChatContainer } from "@/components/ChatContainer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Sales Intelligence Assistant | AI-Powered Sales Insights</title>
        <meta 
          name="description" 
          content="Get instant AI-powered sales insights, lead analysis, and market trends with our Sales Intelligence Assistant." 
        />
      </Helmet>
      <main className="min-h-screen">
        <ChatContainer />
      </main>
    </>
  );
};

export default Index;
