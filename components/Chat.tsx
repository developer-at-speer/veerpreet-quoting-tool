"use client";
import {useChat} from "ai/react"

const Chat = () => {

  const {input, handleInputChange, handleSubmit, isLoading, messages } = useChat();

  console.log(messages);
  console.log(input)

  return (
    <section className="border-2 2xl:max-container relative flex flex-col py-2 lg:mb-0 lg:py-0 xl:mb-0">
      {/* Messages between user and chatAPI */}
      <div className="flex flex-col space-y-4 p-4" onSubmit = {handleSubmit}>
        <div className="bg-gray-200 rounded-lg p-4 self-end max-w-md">
          <h3 className="text-gray-700 font-semibold">You</h3>
          <p className="text-gray-800">Oil Change Price and Details for 2019 Mercedes C300 4Matic 2.0L</p>
        </div>

        <div className="bg-blue-200 rounded-lg p-4 self-start max-w-md">
          <h3 className="text-blue-700 font-semibold">GPT</h3>
          <p className="text-blue-800">Engine Oil</p>
        </div>
      </div>

      <form className="mt-12 flex flex-col items-center">
        <textarea 
          className="mt-2 w-full bg-slate-600 p-2 rounded-md text-white" 
          placeholder="Message VeerAI"
          value = {input}
          onChange = {handleInputChange}
        />
        <button className="rounded-md bg-blue-600 p-2 mt-2 text-white">
          Send Message
        </button>
      </form>
    </section>
  )
}

export default Chat
