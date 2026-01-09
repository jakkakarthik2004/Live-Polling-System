import { useState } from 'react';
import toast from 'react-hot-toast';

const PollCreator = ({ createPoll, error }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(-1);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isMultiSelect, setIsMultiSelect] = useState(false);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const toggleSelection = (index) => {
      if (isMultiSelect) {
          if (selectedIndices.includes(index)) {
              setSelectedIndices(selectedIndices.filter(i => i !== index));
          } else {
              setSelectedIndices([...selectedIndices, index]);
          }
      } else {
          setCorrectOptionIndex(index);
      }
  };

  const handleSubmit = () => {
    if (!question.trim()) return;
    if (options.some(o => !o.trim())) return;
    
    if (isMultiSelect) {
        if (selectedIndices.length === 0) {
            toast.error("Please select at least one correct answer!");
            return;
        }
    } else {
        if (correctOptionIndex === -1) {
            toast.error("Please mark the correct answer!");
            return;
        }
    }
    
    const type = isMultiSelect ? 'multiple' : 'single';
    createPoll(question, options, duration, correctOptionIndex, type, selectedIndices);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray/20 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-bold text-dark">Let's Get Started</h2>
         <div className="flex items-center gap-2">
             <span className="text-sm font-semibold text-gray">Multiple Answers</span>
             <button 
                onClick={() => {
                    setIsMultiSelect(!isMultiSelect);
                    setCorrectOptionIndex(-1);
                    setSelectedIndices([]);
                }}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isMultiSelect ? 'bg-primary' : 'bg-gray/30'}`}
             >
                 <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isMultiSelect ? 'translate-x-6' : 'translate-x-0'}`} />
             </button>
         </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-semibold text-dark mb-2">Enter your question</label>
        <div className="relative">
             <textarea 
                className="w-full bg-light border-none rounded-lg p-4 text-dark focus:ring-2 focus:ring-primary outline-none resize-none h-32"
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={100}
             />
             <span className="absolute bottom-3 right-3 text-xs text-gray">{question.length}/100</span>
        </div>
      </div>

      <div className="mb-6">
         <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-dark">Edit Options</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-light text-sm px-3 py-1 rounded-md outline-none"
            >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={120}>2 Minutes</option>
            </select>
         </div>

         <div className="space-y-3">
            {options.map((opt, idx) => {
                const isSelected = isMultiSelect ? selectedIndices.includes(idx) : correctOptionIndex === idx;
                return (
                    <div key={idx} className="flex items-center gap-2">
                        <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs ml-2">{idx + 1}</span>
                        <input 
                            type="text" 
                            value={opt}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            className="flex-1 bg-light px-4 py-2 rounded-lg outline-none focus:ring-1 focus:ring-primary"
                            placeholder={`Option ${idx + 1}`}
                        />
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => toggleSelection(idx)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-green-500 border-green-500' : 'border-gray/30 bg-white'} ${!isMultiSelect && 'rounded-full'}`}>
                                {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                            </div>
                            {isSelected && <span className="text-xs text-green-500 font-bold">Correct</span>}
                        </div>
                    </div>
                );
            })}
         </div>

         <button 
            onClick={handleAddOption}
            className="mt-4 text-primary text-sm font-semibold border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
         >
            + Add More option
         </button>
      </div>

      <div className="border-t border-gray/20 pt-4 flex justify-end">
          <button 
            onClick={handleSubmit}
            className="bg-secondary text-white px-8 py-2.5 rounded-full font-semibold hover:bg-primary transition-colors disabled:opacity-50"
          >
            Ask Question
          </button>
      </div>
    </div>
  );
};

export default PollCreator;
