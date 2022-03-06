def generate_post_menu (page)
    require 'nokogiri'

    # debug
    puts "Firing :pages, :post_render from : " + File.basename(__FILE__) + " for : " + page.relative_path

    doc = Nokogiri::HTML(page.output)
    menu = doc.search("aside.menu")[1]

    if !menu.nil?
        h2 = doc.search(".card-content h2, .card-content h3")

        if h2.length > 0
            ul_menu = menu.at_css("ul")
            ul_menu.before "<p class='toc'>On this page</p>"

            h2.each do |node|
                if node.name == 'h2'
                    ul_menu.add_child "<li><a href=\"##{node.text.gsub(/[\s\:\,+]+/, "-").downcase}\" class=\"secondary\">#{node.text}</a></li>"
                else
                    ul_menu.add_child "<li><a href=\"##{node.text.gsub(/[\s\:\,+]+/, "-").downcase}\" class=\"secondary\">#{node.text}</a></li>"
                end
            end
        end
    
        page.output = page.output = doc.to_html
    end

end

Jekyll::Hooks.register :posts, :post_render do |page|
    generate_post_menu page
end

Jekyll::Hooks.register :pages, :post_render do |page|
    generate_post_menu page
end
  