'use client';

import { useState } from 'react';
import CardEditor from './components/CardEditor';
import { templates, generateTemplateBackground, Template } from './templates/templateData';
import { Download, Mail, ZoomIn, ZoomOut, Maximize2, Undo, Sticker, Type, Sparkles } from 'lucide-react';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedTemplateData, setSelectedTemplateData] = useState<Template | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [zoom, setZoom] = useState<number>(1);
  const [editorRef, setEditorRef] = useState<any>(null);

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const resetZoom = () => setZoom(1);

  const handleDownload = () => {
    if (editorRef?.handleDownloadImage) {
      editorRef.handleDownloadImage();
    }
  };

  const handleOpenGmail = () => {
    if (editorRef?.handleOpenGmailModal) {
      editorRef.handleOpenGmailModal();
    }
  };

  const handleUndo = () => {
    if (editorRef?.undo) {
      editorRef.undo();
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const templateObj = templates.find(t => t.id === templateId);
    const template = templateId === 'blank' ? null : generateTemplateBackground(templateId);
    setSelectedTemplate(template);
    setSelectedTemplateData(templateObj || null);
    setShowTemplates(false);
  };

  const handleBackToTemplates = () => {
    setShowTemplates(true);
    setSelectedTemplate(null);
    setSelectedTemplateData(null);
  };

  if (!showTemplates) {
    return (
      <div className="">
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628] border-b border-gray-700 px-4 sm:px-6 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back Button */}
            <button
              onClick={handleBackToTemplates}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#ec4899] to-[#26C4E1] text-white rounded-lg hover:opacity-90 transition font-medium text-sm whitespace-nowrap"
            >
              Back
            </button>

            {/* Center: Title */}
            <h1 className="hidden md:block text-lg lg:text-xl font-bold">
              <span className="bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#26C4E1] bg-clip-text text-transparent">
                ALPHA ValenCard Editor
              </span>
            </h1>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Undo Button */}
              <button 
                onClick={handleUndo}
                className="p-1.5 sm:p-2 bg-[#1a2332] border border-gray-700 text-gray-100 rounded-lg hover:bg-[#2a3342] transition" 
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-[#1a2332] border border-gray-700 rounded-lg p-1">
                <button 
                  onClick={zoomOut} 
                  className="p-1.5 sm:p-2 hover:bg-[#2a3342] text-gray-100 rounded transition" 
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button 
                  onClick={resetZoom} 
                  className="px-2 py-1.5 hover:bg-[#2a3342] text-gray-100 rounded transition text-xs font-medium min-w-[50px]" 
                  title="Reset Zoom"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button 
                  onClick={zoomIn} 
                  className="p-1.5 sm:p-2 hover:bg-[#2a3342] text-gray-100 rounded transition" 
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={handleDownload}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#26C4E1] to-[#60a5fa] text-white rounded-lg hover:opacity-90 transition font-medium text-sm whitespace-nowrap"
                title="Download PNG"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">Download</span>
              </button>
              
              <button 
                onClick={handleOpenGmail}
                className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#1a2332] border border-gray-700 text-gray-100 rounded-lg hover:bg-[#2a3342] transition font-medium text-sm whitespace-nowrap"
                title="Send via Gmail"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Send</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <CardEditor 
            template={selectedTemplate} 
            templateData={selectedTemplateData}
            zoom={zoom}
            onRefReady={setEditorRef}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0a1628] via-[#1a2332] to-[#0f1b2d]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#26C4E1] bg-clip-text text-transparent">
              ALPHA ValenCard
            </span>{' '}
            <span className="text-white">Creator</span>
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Create beautiful Valentine cards for your loved ones
          </p>
          <p className="text-sm text-gray-400">
            Powered by{' '}
            <a 
              href="https://alpha-website-2026.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-gradient-to-r from-[#ec4899] to-[#26C4E1] bg-clip-text text-transparent font-semibold hover:opacity-80 transition"
            >
              ALPHA Organization
            </a>
            {' '}- Empowering ICT Students
          </p>
        </div>

        {/* Template Selection */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Choose a Template
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className="group relative bg-[#1a2332] rounded-xl shadow-lg hover:shadow-[0_0_30px_rgba(38,196,225,0.3)] transition-all duration-300 overflow-hidden border border-gray-700 hover:border-[#26C4E1]"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <div
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url("${generateTemplateBackground(template.id)}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  {template.category === 'alpha' && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-[#ec4899] to-[#26C4E1] text-white text-xs px-3 py-1 rounded-full font-semibold">
                      ALPHA Special
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#26C4E1] rounded-xl transition-colors pointer-events-none" />
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(38,196,225,0.2)] transition-all">
            <div className="flex justify-center mb-3">
              <Sticker className="w-12 h-12 text-[#26C4E1]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Custom Stickers</h3>
            <p className="text-sm text-gray-400">Add ALPHA organization stickers and love emojis</p>
          </div>
          <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all">
            <div className="flex justify-center mb-3">
              <Type className="w-12 h-12 text-[#ec4899]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Add Text</h3>
            <p className="text-sm text-gray-400">Personalize with custom messages and colors</p>
          </div>
          <div className="bg-[#1a2332] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">
            <div className="flex justify-center mb-3">
              <Sparkles className="w-12 h-12 text-[#a855f7]" />
            </div>
            <h3 className="font-semibold text-white mb-2">Easy to Use</h3>
            <p className="text-sm text-gray-400">Drag, drop, and create your perfect card</p>
          </div>
        </div>
      </div>
    </div>
  );
}
