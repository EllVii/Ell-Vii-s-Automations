import React, { useEffect, useRef, useState } from "react";

export default function EllViiLeadChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [leadStep, setLeadStep] = useState("firstName");
  const [leadInfo, setLeadInfo] = useState({
    firstName: "",
    contact: "",
  });

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey, welcome to Ell Vii’s Automations. Before we get started, what’s your first name?",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    const savedLead = localStorage.getItem("ellviiLeadInfo");

    if (savedLead) {
      try {
        const parsedLead = JSON.parse(savedLead);

        if (parsedLead?.firstName && parsedLead?.contact) {
          setLeadInfo(parsedLead);
          setLeadStep("ready");
          setMessages([
            {
              role: "bot",
              text: `Welcome back, ${parsedLead.firstName}. How can I help you today?`,
            },
          ]);
        }
      } catch (error) {
        localStorage.removeItem("ellviiLeadInfo");
      }
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isValidPhone = (value) => {
    return /^[0-9+\-().\s]{7,}$/.test(value);
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { role: "bot", text }]);
  };

  const saveLead = (updatedLead) => {
    setLeadInfo(updatedLead);
    localStorage.setItem("ellviiLeadInfo", JSON.stringify(updatedLead));

    console.log("New Ell Vii Automations lead:", {
      ...updatedLead,
      source: "Ell Vii Automations Chatbot",
      createdAt: new Date().toISOString(),
    });
  };

  const getBotResponse = async (userText, lead) => {
    /*
      Replace this section later with your Gemini / backend API call.

      Recommended backend payload:

      {
        firstName: lead.firstName,
        contact: lead.contact,
        message: userText,
        source: "Ell Vii Automations Chatbot"
      }
    */

    return `Absolutely, ${lead.firstName}. Ell Vii’s Automations helps small businesses with professional websites, SEO, lead capture, CRM workflows, and chatbot automation. What type of business are you trying to grow?`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    if (leadStep === "firstName") {
      const cleanName = userText.replace(/[^a-zA-ZÀ-ÿ' -]/g, "").trim();
      const firstName = cleanName.split(" ")[0];

      if (!firstName || firstName.length < 2) {
        addBotMessage("I’ll need your first name before we get started.");
        return;
      }

      const updatedLead = {
        ...leadInfo,
        firstName,
      };

      setLeadInfo(updatedLead);
      setLeadStep("contact");

      addBotMessage(
        `Thanks, ${firstName}. What’s the best way to reach you — email or phone number?`
      );

      return;
    }

    if (leadStep === "contact") {
      const validContact = isValidEmail(userText) || isValidPhone(userText);

      if (!validContact) {
        addBotMessage(
          `${leadInfo.firstName || "Thanks"}, I’ll need either a valid email address or phone number before we continue.`
        );
        return;
      }

      const updatedLead = {
        ...leadInfo,
        contact: userText,
      };

      saveLead(updatedLead);
      setLeadStep("ready");

      addBotMessage(`Perfect, ${updatedLead.firstName}. How can I help you today?`);

      return;
    }

    const reply = await getBotResponse(userText, leadInfo);
    addBotMessage(reply);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-black px-5 py-4 text-sm font-semibold text-white shadow-xl hover:bg-neutral-800"
      >
        {isOpen ? "Close Chat" : "Chat with us"}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">
          <div className="bg-black px-5 py-4 text-white">
            <h3 className="text-base font-bold">Ell Vii’s Automations</h3>
            <p className="text-xs text-neutral-300">
              Websites • SEO • CRM • Lead Capture
            </p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-black text-white"
                      : "bg-white text-neutral-900 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-neutral-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  leadStep === "firstName"
                    ? "Enter your first name..."
                    : leadStep === "contact"
                    ? "Enter email or phone..."
                    : "Type your message..."
                }
                className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
              />

              <button
                onClick={handleSendMessage}
                className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Send
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-neutral-500">
              By chatting, you agree to be contacted about your request.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
